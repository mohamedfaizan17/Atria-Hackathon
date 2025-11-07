const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedBlog() {
  try {
    console.log('🌱 Seeding blog posts...');

    // First, we need a user (author)
    let user = await prisma.user.findFirst();
    
    if (!user) {
      console.log('📝 Creating admin user...');
      user = await prisma.user.create({
        data: {
          name: 'Admin User',
          email: 'admin@mastersolis.com',
          password: '$2a$10$abcdefghijklmnopqrstuv', // Hashed password (won't work for login, just for seeding)
          role: 'admin',
          isActive: true
        }
      });
      console.log('✅ Admin user created');
    }

    // Sample blog posts
    const blogPosts = [
      {
        title: 'Getting Started with React in 2025',
        content: `# Introduction to React

React has revolutionized the way we build modern web applications. In this comprehensive guide, we'll explore the latest features and best practices for building React applications in 2025.

## Why React?

React provides a component-based architecture that makes it easy to build reusable UI elements. With its virtual DOM and efficient rendering, React delivers exceptional performance even in complex applications.

## Key Features

1. **Component-Based Architecture**: Build encapsulated components that manage their own state
2. **Virtual DOM**: Efficient updates and rendering
3. **Rich Ecosystem**: Thousands of libraries and tools
4. **Strong Community**: Extensive documentation and support

## Getting Started

To start with React, you'll need Node.js installed. Then simply run:

\`\`\`bash
npx create-react-app my-app
cd my-app
npm start
\`\`\`

## Best Practices

- Use functional components with hooks
- Implement proper state management
- Follow component composition patterns
- Write tests for critical functionality
- Optimize performance with React.memo and useMemo

## Conclusion

React continues to be one of the most popular frameworks for building modern web applications. Its flexibility, performance, and extensive ecosystem make it an excellent choice for projects of any size.`,
        category: 'Development',
        tags: JSON.stringify(['react', 'javascript', 'web-development', 'frontend']),
        featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
        isPublished: true,
        publishedAt: new Date('2025-01-15'),
        views: 245,
        likes: 18
      },
      {
        title: 'AI-Powered Development: The Future is Here',
        content: `# The AI Revolution in Software Development

Artificial Intelligence is transforming how we write code, debug applications, and build software products. Let's explore how AI is reshaping the development landscape.

## AI in Code Generation

Modern AI tools can generate code snippets, complete functions, and even entire components based on natural language descriptions. This dramatically speeds up development time.

## Benefits of AI-Assisted Development

- **Faster Development**: Generate boilerplate code instantly
- **Better Code Quality**: AI suggests best practices and optimizations
- **Learning Tool**: Great for understanding new concepts
- **Reduced Errors**: Catch bugs before they reach production

## Popular AI Development Tools

1. GitHub Copilot
2. ChatGPT
3. Tabnine
4. Amazon CodeWhisperer

## Real-World Applications

Companies are already using AI to:
- Automate testing
- Generate documentation
- Review code
- Optimize performance
- Detect security vulnerabilities

## The Human Element

While AI is powerful, human developers remain essential. AI tools augment our capabilities but don't replace the creativity, problem-solving, and strategic thinking that humans bring to software development.

## Looking Forward

The future of development is collaborative - humans and AI working together to build better software faster. Embrace these tools and stay ahead of the curve!`,
        category: 'Technology',
        tags: JSON.stringify(['ai', 'machine-learning', 'development', 'future']),
        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        isPublished: true,
        publishedAt: new Date('2025-01-20'),
        views: 389,
        likes: 42
      },
      {
        title: 'Building Scalable Node.js Applications',
        content: `# Scalability Best Practices for Node.js

Node.js is perfect for building scalable network applications. This guide covers essential patterns and practices for building applications that can handle growth.

## Architecture Patterns

### Microservices
Breaking your application into smaller, independent services allows for better scalability and maintainability.

### Event-Driven Architecture
Use events to decouple components and improve system responsiveness.

## Performance Optimization

1. **Use Clustering**: Leverage multiple CPU cores
2. **Implement Caching**: Redis or Memcached for frequently accessed data
3. **Database Optimization**: Proper indexing and query optimization
4. **Load Balancing**: Distribute traffic across multiple servers

## Code Examples

\`\`\`javascript
// Clustering example
const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker processes
  require('./app');
}
\`\`\`

## Monitoring and Logging

Implement proper monitoring with tools like:
- PM2
- New Relic
- DataDog
- Custom metrics with Prometheus

## Conclusion

Building scalable Node.js applications requires careful planning and implementation of best practices. Start with these fundamentals and scale as your application grows.`,
        category: 'Development',
        tags: JSON.stringify(['nodejs', 'backend', 'scalability', 'performance']),
        featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
        isPublished: true,
        publishedAt: new Date('2025-01-25'),
        views: 156,
        likes: 23
      },
      {
        title: 'Company Update: Exciting New Projects Coming Soon',
        content: `# Mastersolis Infotech - Q1 2025 Update

We're thrilled to share some exciting updates about our upcoming projects and company growth!

## New Client Partnerships

This quarter, we've partnered with several innovative companies across various industries:

- **Healthcare**: Building a patient management system
- **E-commerce**: Developing a next-gen shopping platform
- **Education**: Creating an interactive learning platform

## Team Expansion

We're growing! We're looking for talented developers, designers, and project managers to join our team. Check out our careers page for open positions.

## Technology Investments

We're investing in cutting-edge technologies:
- AI and Machine Learning
- Cloud Infrastructure
- Mobile Development
- Cybersecurity

## Community Engagement

We're committed to giving back:
- Tech workshops for students
- Open-source contributions
- Mentorship programs
- Industry events and conferences

## Looking Ahead

The future is bright! We're excited about the innovative solutions we're building and the impact we're making.

Stay tuned for more updates and thank you for being part of our journey!

**- The Mastersolis Team**`,
        category: 'Company Update',
        tags: JSON.stringify(['company-news', 'updates', 'growth', 'team']),
        featuredImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
        isPublished: true,
        publishedAt: new Date('2025-02-01'),
        views: 512,
        likes: 67
      },
      {
        title: 'Database Design Best Practices',
        content: `# Mastering Database Design

A well-designed database is the foundation of any successful application. Let's explore key principles and best practices.

## Normalization

Understanding normal forms helps eliminate data redundancy:
- **1NF**: Atomic values
- **2NF**: No partial dependencies
- **3NF**: No transitive dependencies

## Indexing Strategy

Proper indexing can dramatically improve query performance:

\`\`\`sql
-- Create index for frequently queried columns
CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_post_published ON posts(published_at, status);
\`\`\`

## Data Types

Choose appropriate data types to optimize storage and performance:
- Use VARCHAR instead of TEXT when possible
- Use INT instead of BIGINT when values fit
- Use DECIMAL for monetary values

## Relationships

Understanding relationships is crucial:
- One-to-One
- One-to-Many
- Many-to-Many

## Performance Tips

1. Avoid SELECT *
2. Use LIMIT in queries
3. Implement proper caching
4. Monitor slow queries
5. Regular maintenance and optimization

## Security Considerations

- Always use parameterized queries
- Implement proper access controls
- Encrypt sensitive data
- Regular backups
- Audit logging

## Conclusion

Good database design requires planning and understanding of your application's needs. Invest time upfront to avoid costly refactoring later.`,
        category: 'Tutorial',
        tags: JSON.stringify(['database', 'sql', 'design', 'best-practices']),
        featuredImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
        isPublished: true,
        publishedAt: new Date('2025-02-05'),
        views: 198,
        likes: 31
      }
    ];

    // Create blog posts
    for (const post of blogPosts) {
      const slug = post.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const readTime = Math.ceil(post.content.split(/\s+/).length / 200);

      const blog = await prisma.blog.create({
        data: {
          ...post,
          slug,
          readTime,
          authorId: user.id,
          summary: post.content.substring(0, 200) + '...',
          seoDescription: post.content.substring(0, 150) + '...'
        }
      });

      console.log(`✅ Created blog: ${blog.title}`);
    }

    console.log('\n🎉 Blog seeding completed successfully!');
    console.log(`📊 Created ${blogPosts.length} blog posts`);
    console.log('\n🌐 Visit http://localhost:3000/blog to see your blogs!');

  } catch (error) {
    console.error('❌ Error seeding blog:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedBlog();
