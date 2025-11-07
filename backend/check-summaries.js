const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSummaries() {
  try {
    const blogs = await prisma.blog.findMany({
      select: {
        title: true,
        summary: true
      }
    });

    console.log('📊 Current Blog Summaries:\n');
    
    blogs.forEach((blog, index) => {
      console.log(`${index + 1}. ${blog.title}`);
      console.log(`   Summary: ${blog.summary}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSummaries();
