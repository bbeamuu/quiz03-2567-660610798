
import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

import { Payload } from "@lib/DB";

export const GET = async (request: NextRequest) => {
  readDB();
  const roomId = request.nextUrl.searchParams.get("roomId");

  const messages = DB.messages.filter((message: { roomId: string | null; }) => message.roomId === roomId)

  if (messages.length == 0) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  
  return NextResponse.json(
    {
      ok: true,
      messages,
    },
    { status: 200 }
  );
};

export const POST = async (request: NextRequest) => {
  readDB();
  const body = await request.json();
  const roomId = body.roomId;
  const messageText = body.messageText;
  
  const foundRoom = DB.rooms.find((room) => room.roomId === roomId)

  if(!foundRoom){
    return NextResponse.json(
      {
        ok: false,
        message: `Room is not found`,
      },
      { status: 404 }
    );
  }
  
  const messageId = nanoid();
  DB.messages.push({
    roomId,
    messageId,
    messageText,
  })

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const body = await request.json();
  const payload = checkToken();
  const role = (<Payload>payload).role;
  const {messageId} = body;

  console.log(messageId)

  if(!payload || role != "SUPER_ADMIN"){
    return NextResponse.json(
       {
         ok: false,
         message: "Invalid token",
       },
       { status: 401 }
     );
  }

  readDB();

  const messageIndex = DB.messages.findIndex((message) => message.messageId === messageId);


  if (messageIndex === -1) {
    return NextResponse.json(
      {
        ok: false,
        message: "Message is not found",
      },
      { status: 404 }
    );
  }

  DB.messages.splice(messageIndex, 1);

  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};