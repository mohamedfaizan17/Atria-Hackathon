const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanSummaries() {
  try {
    console.log('🧹 Cleaning blog summaries...');

    const blogs = await prisma.blog.findMany();

    for (const blog of blogs) {
      if (blog.summary) {
        // Clean the summary
        const cleanSummary = blog.summary
          .replace(/#{1,6}\s+/g, '') // Remove markdown headings
          .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
          .replace(/\*(.+?)\*/g, '$1') // Remove italic
          .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
          .replace(/`([^`]+)`/g, '$1') // Remove inline code
          .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
          .replace(/\.{3,}/g, '.') // Remove ellipsis
          .replace(/\n+/g, ' ') // Replace newlines with spaces
          .replace(/\s+/g, ' ') // Normalize spaces
          .trim();

        // Update the blog
        await prisma.blog.update({
          where: { id: blog.id },
          data: { summary: cleanSummary }
        });

        console.log(`✅ Cleaned: ${blog.title}`);
      }
    }

    console.log('\n🎉 All summaries cleaned!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanSummaries();
