import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function resetUsers() {
  try {
    console.log("🔄 Starting database reset...");

    // Delete all existing users
    const deletedUsers = await prisma.user.deleteMany();
    console.log(`✅ Deleted ${deletedUsers.count} existing users`);

    // Delete all accounts (OAuth accounts)
    const deletedAccounts = await prisma.account.deleteMany();
    console.log(`✅ Deleted ${deletedAccounts.count} OAuth accounts`);

    // Delete all sessions
    const deletedSessions = await prisma.session.deleteMany();
    console.log(`✅ Deleted ${deletedSessions.count} sessions`);

    // Delete all posts
    const deletedPosts = await prisma.post.deleteMany();
    console.log(`✅ Deleted ${deletedPosts.count} posts`);

    // Delete all verification tokens
    const deletedTokens = await prisma.verificationToken.deleteMany();
    console.log(`✅ Deleted ${deletedTokens.count} verification tokens`);

    console.log("🎉 Database reset completed successfully!");
    console.log(
      "📝 You can now register new users with proper password hashing."
    );
  } catch (error) {
    console.error("❌ Error resetting database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUsers();
