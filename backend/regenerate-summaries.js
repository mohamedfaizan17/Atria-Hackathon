const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Function to extract clean, complete sentences
function extractCleanSummary(content, numSentences = 3) {
  // Remove ALL markdown formatting
  let cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
    .replace(/```[\s\S]*?```/g, '') // Remove multiline code
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    .replace(/^[>\s]+/gm, '') // Remove blockquotes
    .replace(/^[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\d+\.\s+/gm, '') // Remove numbered lists
    .replace(/\n+/g, ' ') // Replace newlines
    .replace(/\.{3,}/g, '') // Remove ellipsis
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();

  // Split into sentences - more robust regex
  // Matches text that ends with . ! or ? followed by space and capital letter or end of string
  const sentences = [];
  const sentencePattern = /([^.!?]+[.!?]+)/g;
  let match;
  
  while ((match = sentencePattern.exec(cleanContent)) !== null) {
    const sentence = match[1].trim();
    // Only include sentences that are substantial (more than 30 characters)
    if (sentence.length > 30 && !sentence.match(/^[\s\W]*$/)) {
      sentences.push(sentence);
    }
  }

  // If we didn't get enough sentences, try splitting by periods
  if (sentences.length < numSentences) {
    const parts = cleanContent.split(/\.\s+/);
    sentences.length = 0;
    for (let part of parts) {
      part = part.trim();
      if (part.length > 30) {
        // Add period back if it doesn't end with punctuation
        if (!part.match(/[.!?]$/)) {
          part += '.';
        }
        sentences.push(part);
      }
      if (sentences.length >= numSentences) break;
    }
  }

  // Take the requested number of sentences
  let summary = sentences.slice(0, numSentences).join(' ').trim();

  // Ensure it ends with proper punctuation
  if (summary && !summary.match(/[.!?]$/)) {
    summary += '.';
  }

  return summary;
}

async function regenerateSummaries() {
  try {
    console.log('🔄 Regenerating blog summaries from content...\n');

    const blogs = await prisma.blog.findMany();

    for (const blog of blogs) {
      console.log(`📝 Processing: ${blog.title}`);
      
      // Extract clean summary from content
      const newSummary = extractCleanSummary(blog.content, 3);
      
      console.log(`   Summary: ${newSummary.substring(0, 100)}...`);
      
      // Update the blog
      await prisma.blog.update({
        where: { id: blog.id },
        data: { summary: newSummary }
      });

      console.log(`   ✅ Updated!\n`);
    }

    console.log('🎉 All summaries regenerated successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

regenerateSummaries();
