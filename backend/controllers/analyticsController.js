const Analytics = require('../models/Analytics');

// @desc    Track page view
// @route   POST /api/analytics/track
// @access  Public
exports.trackPageView = async (req, res, next) => {
  try {
    const { page, timeSpent, source, device, browser, country } = req.body;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find or create today's analytics
    let analytics = await Analytics.findOne({ date: today });

    if (!analytics) {
      analytics = await Analytics.create({
        date: today,
        pageViews: 0,
        uniqueVisitors: 0,
        pageData: [],
        sources: [],
        devices: { desktop: 0, mobile: 0, tablet: 0 },
        browsers: [],
        topCountries: []
      });
    }

    // Update page views
    analytics.pageViews += 1;

    // Update page data
    const pageIndex = analytics.pageData.findIndex(p => p.page === page);
    if (pageIndex > -1) {
      analytics.pageData[pageIndex].views += 1;
      if (timeSpent) {
        const currentAvg = analytics.pageData[pageIndex].avgTimeSpent || 0;
        const currentCount = analytics.pageData[pageIndex].views;
        analytics.pageData[pageIndex].avgTimeSpent = 
          ((currentAvg * (currentCount - 1)) + timeSpent) / currentCount;
      }
    } else {
      analytics.pageData.push({
        page,
        views: 1,
        avgTimeSpent: timeSpent || 0
      });
    }

    // Update source
    if (source) {
      const sourceIndex = analytics.sources.findIndex(s => s.source === source);
      if (sourceIndex > -1) {
        analytics.sources[sourceIndex].count += 1;
      } else {
        analytics.sources.push({ source, count: 1 });
      }
    }

    // Update device
    if (device) {
      if (device === 'desktop') analytics.devices.desktop += 1;
      else if (device === 'mobile') analytics.devices.mobile += 1;
      else if (device === 'tablet') analytics.devices.tablet += 1;
    }

    // Update browser
    if (browser) {
      const browserIndex = analytics.browsers.findIndex(b => b.name === browser);
      if (browserIndex > -1) {
        analytics.browsers[browserIndex].count += 1;
      } else {
        analytics.browsers.push({ name: browser, count: 1 });
      }
    }

    // Update country
    if (country) {
      const countryIndex = analytics.topCountries.findIndex(c => c.country === country);
      if (countryIndex > -1) {
        analytics.topCountries[countryIndex].count += 1;
      } else {
        analytics.topCountries.push({ country, count: 1 });
      }
    }

    await analytics.save();

    res.status(200).json({
      success: true,
      message: 'Analytics tracked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Track conversion
// @route   POST /api/analytics/conversion
// @access  Public
exports.trackConversion = async (req, res, next) => {
  try {
    const { type } = req.body; // 'contactForms', 'jobApplications', 'chatInteractions'
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let analytics = await Analytics.findOne({ date: today });

    if (!analytics) {
      analytics = await Analytics.create({
        date: today,
        conversions: {
          contactForms: 0,
          jobApplications: 0,
          chatInteractions: 0
        }
      });
    }

    if (type && analytics.conversions[type] !== undefined) {
      analytics.conversions[type] += 1;
      await analytics.save();
    }

    res.status(200).json({
      success: true,
      message: 'Conversion tracked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
  try {
    const { startDate, endDate, days } = req.query;
    
    let filter = {};
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    } else if (days) {
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(days));
      filter.date = { $gte: daysAgo };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      filter.date = { $gte: thirtyDaysAgo };
    }

    const analytics = await Analytics.find(filter).sort({ date: 1 });

    // Calculate totals
    const totals = analytics.reduce((acc, day) => {
      acc.pageViews += day.pageViews || 0;
      acc.uniqueVisitors += day.uniqueVisitors || 0;
      acc.conversions.contactForms += day.conversions.contactForms || 0;
      acc.conversions.jobApplications += day.conversions.jobApplications || 0;
      acc.conversions.chatInteractions += day.conversions.chatInteractions || 0;
      return acc;
    }, {
      pageViews: 0,
      uniqueVisitors: 0,
      conversions: {
        contactForms: 0,
        jobApplications: 0,
        chatInteractions: 0
      }
    });

    // Aggregate page data
    const pageDataMap = new Map();
    analytics.forEach(day => {
      day.pageData.forEach(pd => {
        if (pageDataMap.has(pd.page)) {
          const existing = pageDataMap.get(pd.page);
          existing.views += pd.views;
          existing.totalTimeSpent += pd.avgTimeSpent * pd.views;
        } else {
          pageDataMap.set(pd.page, {
            page: pd.page,
            views: pd.views,
            totalTimeSpent: pd.avgTimeSpent * pd.views
          });
        }
      });
    });

    const aggregatedPageData = Array.from(pageDataMap.values()).map(pd => ({
      page: pd.page,
      views: pd.views,
      avgTimeSpent: pd.totalTimeSpent / pd.views
    })).sort((a, b) => b.views - a.views);

    res.status(200).json({
      success: true,
      data: {
        daily: analytics,
        totals,
        topPages: aggregatedPageData.slice(0, 10)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics summary
// @route   GET /api/analytics/summary
// @access  Private (Admin)
exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const [todayData, yesterdayData, lastWeekData] = await Promise.all([
      Analytics.findOne({ date: today }),
      Analytics.findOne({ date: yesterday }),
      Analytics.find({ date: { $gte: lastWeek } })
    ]);

    const weeklyTotals = lastWeekData.reduce((acc, day) => {
      acc.pageViews += day.pageViews || 0;
      acc.uniqueVisitors += day.uniqueVisitors || 0;
      return acc;
    }, { pageViews: 0, uniqueVisitors: 0 });

    const summary = {
      today: {
        pageViews: todayData?.pageViews || 0,
        uniqueVisitors: todayData?.uniqueVisitors || 0,
        conversions: todayData?.conversions || {}
      },
      yesterday: {
        pageViews: yesterdayData?.pageViews || 0,
        uniqueVisitors: yesterdayData?.uniqueVisitors || 0
      },
      lastWeek: weeklyTotals,
      trends: {
        pageViewsChange: todayData && yesterdayData 
          ? ((todayData.pageViews - yesterdayData.pageViews) / (yesterdayData.pageViews || 1)) * 100
          : 0,
        visitorsChange: todayData && yesterdayData
          ? ((todayData.uniqueVisitors - yesterdayData.uniqueVisitors) / (yesterdayData.uniqueVisitors || 1)) * 100
          : 0
      }
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error) {
    next(error);
  }
};
