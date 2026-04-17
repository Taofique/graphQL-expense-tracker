import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

const userResolvers = {
  Mutation: {
    signUp: async (_, { input }) => {
      const { username, name, password, gender } = input;

      //Check if user exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error("User already exists");
      }

      //Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create user in database
      const newUser = new User({
        username,
        name,
        password: hashedPassword,
        gender,
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

    login: async (_, { input }) => {
      const { username, password } = input;

      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("Invalid password");
      }

      return {
        _id: user._id,
        username: user.username,
        name: user.name,
        gender: user.gender,
        profilePicture: user.profilePicture,
      };
    },
  },

  Query: {
    _placeholder: () => "placeholder",
  },
};

export default userResolvers;
