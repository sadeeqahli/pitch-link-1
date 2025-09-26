import { mutation } from "./_generated/server";

export const createTestUser = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.db.insert("users", {
      name: "Sadeeqahli",
      email: "hamisuabubakar27@gmail.com",
      phone: "+2341234567890",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    console.log(`Created test user with ID: ${userId}`);
    return userId;
  },
});