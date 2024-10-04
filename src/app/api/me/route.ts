
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Supakorn Booranachart",
    studentId: "660610798",
  });
};
