import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      password: adminPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });
  console.log("✅ Created admin user:", admin.email);

  // Create regular user
  const userPassword = await bcrypt.hash("user123", 10);
  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      email: "user@example.com",
      name: "Regular User",
      password: userPassword,
      role: "USER",
      status: "ACTIVE",
    },
  });
  console.log("✅ Created regular user:", user.email);

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      title: "Welcome to NextApp",
      content:
        "This is a sample post created during database seeding. You can create, edit, and delete posts through the dashboard.",
      published: true,
      authorId: admin.id,
    },
  });
  console.log("✅ Created sample post:", post1.title);

  const post2 = await prisma.post.create({
    data: {
      title: "Getting Started with the Platform",
      content:
        "Explore the dashboard to discover features like user management, app marketplace, and analytics.",
      published: true,
      authorId: user.id,
    },
  });
  console.log("✅ Created sample post:", post2.title);

  // Create sample app definitions
  const crmApp = await prisma.appDefinition.create({
    data: {
      name: "crm",
      displayName: "Customer Relationship Management",
      description: "Manage contacts, deals, and sales pipeline",
      version: "1.0.0",
      category: "Sales",
      route: "/apps/crm",
      isActive: false, // Not yet implemented
      isPublic: true,
    },
  });
  console.log("✅ Created app definition:", crmApp.displayName);

  const pmApp = await prisma.appDefinition.create({
    data: {
      name: "project-management",
      displayName: "Project Management",
      description: "Tasks, sprints, and team collaboration",
      version: "1.0.0",
      category: "Productivity",
      route: "/apps/project-management",
      isActive: false,
      isPublic: true,
    },
  });
  console.log("✅ Created app definition:", pmApp.displayName);

  const inventoryApp = await prisma.appDefinition.create({
    data: {
      name: "inventory",
      displayName: "Inventory Management",
      description: "Track products, stock, and suppliers",
      version: "1.0.0",
      category: "Operations",
      route: "/apps/inventory",
      isActive: false,
      isPublic: true,
    },
  });
  console.log("✅ Created app definition:", inventoryApp.displayName);

  // Log activity for admin
  await prisma.activityLog.create({
    data: {
      userId: admin.id,
      action: "user.login",
      entityType: "User",
      entityId: admin.id,
      metadata: {
        source: "seed",
      },
    },
  });
  console.log("✅ Created activity log");

  console.log("\n🎉 Database seeded successfully!");
  console.log("\n📝 Login credentials:");
  console.log("   Admin:");
  console.log("   - Email: admin@example.com");
  console.log("   - Password: admin123");
  console.log("\n   User:");
  console.log("   - Email: user@example.com");
  console.log("   - Password: user123");
  console.log("\n⚠️  Change these credentials in production!\n");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
