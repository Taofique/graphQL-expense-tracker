import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userResolvers = {
  Mutation: {
    signUp: async (_, { input }) => {
      const { username, name, password, gender } = input;

      // Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error("User already exists");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user in database
      const newUser = new User({
        username,
        name,
        password: hashedPassword,
        gender,
        profilePicture:
          gender === "male"
            ? `https://avatar.iran.liara.run/public/boy?username=${username}`
            : `https://avatar.iran.liara.run/public/girl?username=${username}`,
      });

      await newUser.save();

      // Return without password
      return {
        _id: newUser._id,
        username: newUser.username,
        name: newUser.name,
        gender: newUser.gender,
        profilePicture: newUser.profilePicture,
      };
    },

    login: async (_, { input }, context) => {
      const { username, password } = input;

      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("Invalid password");
      }

      const userData = {
        _id: user._id,
        username: user.username,
        name: user.name,
        gender: user.gender,
        profilePicture: user.profilePicture,
      };

      // For real server with session tracking
      if (context.req) {
        context.req.session.user = userData;
      }

      // For tests (backward compatibility)
      context.currentUser = userData;

      console.log("Login successful, user:", userData.username);
      return userData;
    },

    logout: async (_, __, context) => {
      // For real server with session tracking
      if (context.req) {
        context.req.session.destroy((err) => {
          if (err) {
            console.log("Logout error:", err);
          }
        });
      }

      // For tests (backward compatibility)
      context.currentUser = null;

      console.log("Logout called, user cleared");
      return {
        message: "Logged out successfully",
      };
    },
  },

  Query: {
    _placeholder: () => "placeholder",
    authUser: async (_, __, context) => {
      const user = context.req?.session?.user || context.currentUser;
      console.log("authUser called, currentUser:", user?.username || null);
      return user;
    },
  },
};

export default userResolvers;
