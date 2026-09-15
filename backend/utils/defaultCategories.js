const Category = require("../models/Category");

const DEFAULT_CATEGORIES = [
  // Expense Categories
  { name: "Food", type: "expense", color: "#EF4444", icon: "Utensils", isDefault: true },
  { name: "Transport", type: "expense", color: "#F97316", icon: "Car", isDefault: true },
  { name: "Shopping", type: "expense", color: "#EC4899", icon: "ShoppingBag", isDefault: true },
  { name: "Bills", type: "expense", color: "#8B5CF6", icon: "FileText", isDefault: true },
  { name: "Entertainment", type: "expense", color: "#3B82F6", icon: "Film", isDefault: true },
  { name: "Health", type: "expense", color: "#10B981", icon: "Activity", isDefault: true },
  { name: "Education", type: "expense", color: "#06B6D4", icon: "BookOpen", isDefault: true },
  { name: "Other", type: "expense", color: "#64748B", icon: "MoreHorizontal", isDefault: true },

  // Income Categories
  { name: "Salary", type: "income", color: "#10B981", icon: "Briefcase", isDefault: true },
  { name: "Freelance", type: "income", color: "#06B6D4", icon: "Laptop", isDefault: true },
  { name: "Business", type: "income", color: "#3B82F6", icon: "TrendingUp", isDefault: true },
  { name: "Investment", type: "income", color: "#8B5CF6", icon: "DollarSign", isDefault: true },
  { name: "Other", type: "income", color: "#64748B", icon: "PlusCircle", isDefault: true },
];

/**
 * Seed default categories for a specific user if they do not already have any
 */
const seedDefaultCategories = async (userId) => {
  try {
    const existingCount = await Category.countDocuments({ user: userId });
    if (existingCount === 0) {
      const categoriesToInsert = DEFAULT_CATEGORIES.map((cat) => ({
        ...cat,
        user: userId,
      }));
      await Category.insertMany(categoriesToInsert);
      console.log(`Seeded default categories for user: ${userId}`);
    }
  } catch (error) {
    console.error("Error seeding default categories:", error.message);
  }
};

module.exports = {
  DEFAULT_CATEGORIES,
  seedDefaultCategories,
};
