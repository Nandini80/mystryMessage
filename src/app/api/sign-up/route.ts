import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerifiedWithSameUserName = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingUserVerifiedWithSameUserName) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        { status: 400 }
      );
    }
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const existingUserWithSameEmail = await UserModel.findOne({
      email,
      isVerified: true,
    });
    if (existingUserWithSameEmail) {
      if (existingUserWithSameEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: "Same email id already exists",
          },
          { status: 500 }
        );
      } else {
        const hashPassword = await bcrypt.hash(password, 10);
        existingUserWithSameEmail.password = hashPassword;
        existingUserWithSameEmail.verifyCode = verifyCode;
        existingUserWithSameEmail.verifyCodeExpiry = new Date(
          Date.now() + 3600000
        );

        await existingUserWithSameEmail.save();
      }
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        message: [],
      });

      await newUser.save();
    }

    // send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your email",
      },
      { status: 500 }
    );

    
  } catch (error) {
    console.error("Error registring user ", error);
    return Response.json(
      {
        success: false,
        message: "Error registring user",
      },
      {
        status: 500,
      }
    );
  }
}
