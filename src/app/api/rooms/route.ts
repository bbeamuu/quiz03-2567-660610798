
import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();

  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: DB.rooms.length
  });
};


export const POST = async (request: NextRequest) => {
  

  const payload = checkToken()

  if(!payload){
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
    

  readDB();

  const body = await request.json();
  const { roomName } = body;

  const foundName = DB.rooms.find(
    (x) => x.roomName === roomName
  );

  if (foundName) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();

  DB.rooms.push({
    roomName,
    roomId,
  })
  //call writeDB after modifying Database


  writeDB();

  return NextResponse.json({
    ok: true,
    //roomId,
    message: `Room ${roomName} has been created`,
  });
};