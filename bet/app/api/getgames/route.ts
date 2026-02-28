import dbClient from "../../../db";
import { NextResponse } from "next/server";
import axios from "axios";
import { findLongestWord } from "./../../tools/func";
import { searchAndPrintLastChars } from "./../../../getodd";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const dateParam = url.searchParams.get("date");

    // ✅ Validate date param
    let givenDate = Number(dateParam);
    if (isNaN(givenDate) || givenDate < 0 || givenDate > 7) {
      return NextResponse.json(
        { error: "Invalid date parameter. Must be between 0 and 7." },
        { status: 400 },
      );
    }

    const today = new Date();
    const nex = new Date(today.getTime() + givenDate * 86400000);

    const options = { timeZone: "Africa/Lagos" };
    const dateLst = nex.toLocaleDateString("en-US", options).split("/");

    if (dateLst.length !== 3) {
      return NextResponse.json(
        { error: "Date formatting failed." },
        { status: 500 },
      );
    }

    if (dateLst[0].length === 1) dateLst[0] = "0" + dateLst[0];
    if (dateLst[1].length === 1) dateLst[1] = "0" + dateLst[1];

    const date_ = dateLst[2] + dateLst[0] + dateLst[1];

    // ✅ Mongo query with error handling
    let sGames;
    try {
      const db = await dbClient.db();
      sGames = await db.collection("dates").findOne({ date: date_ });
    } catch (dbError: any) {
      return NextResponse.json(
        { error: "Database error", details: dbError.message },
        { status: 500 },
      );
    }

    const oddLst: any[] = [];

    if (!sGames) {
      let gamesJson;

      // ✅ External API call safe block
      try {
        const response = await axios.get(
          `https://prod-public-api.livescore.com/v1/api/app/date/soccer/${date_}/1?countryCode=NG&locale=en&MD=1`,
        );
        gamesJson = response.data;
      } catch (apiError: any) {
        return NextResponse.json(
          { error: "Livescore API request failed", details: apiError.message },
          { status: 500 },
        );
      }

      if (!gamesJson?.Stages) {
        return NextResponse.json(
          { error: "Invalid API response structure. 'Stages' missing." },
          { status: 500 },
        );
      }

      const gjLen = gamesJson.Stages.length;

      for (let i = 0; i < gjLen; i++) {
        let eventDit = {
          id: i.toString(),
          titleCountry: gamesJson.Stages[i].Cnm,
          subtitle: gamesJson.Stages[i].Snm,
          events: [] as any[],
        };

        const evtLen = gamesJson.Stages[i]?.Events?.length || 0;

        for (let j = 0; j < evtLen; j++) {
          if (gamesJson.Stages[i].Events[j].Eps !== "NS") continue;

          const Edt = {
            id: j.toString(),
            hometeam: gamesJson.Stages[i].Events[j].T1?.[0]?.Nm || "",
            awayteam: gamesJson.Stages[i].Events[j].T2?.[0]?.Nm || "",
            homeodd: "1.7",
            drawodd: "3.1",
            awayodd: "1.8",
            Esd: gamesJson.Stages[i].Events[j].Esd?.toString() || "",
          };

          try {
            const Team1L = findLongestWord(Edt.hometeam);
            const Team2L = findLongestWord(Edt.awayteam);
            const bothTeam = `${Team1L}=${Team2L}`;
            const oddG = await searchAndPrintLastChars(bothTeam, "output.txt");

            if (oddG) {
              const splitStr = oddG.split(" ").reverse();
              Edt.homeodd = splitStr[2] || Edt.homeodd;
              Edt.drawodd = splitStr[1] || Edt.drawodd;
              Edt.awayodd = splitStr[0] || Edt.awayodd;
            }
          } catch (oddError: any) {
            return NextResponse.json(
              { error: "Odd processing failed", details: oddError.message },
              { status: 500 },
            );
          }

          eventDit.events.push(Edt);
        }

        if (eventDit.events.length > 0) {
          oddLst.push(eventDit);
        }
      }

      try {
        const db = await dbClient.db();
        await db.collection("dates").insertOne({
          date: date_,
          games: oddLst,
        });
      } catch (insertError: any) {
        return NextResponse.json(
          {
            error: "Failed to save games to database",
            details: insertError.message,
          },
          { status: 500 },
        );
      }
    }

    // ✅ Generate date list (unchanged logic)
    const dates = [];
    const todayy = new Date();

    for (let i = 0; i <= 7; i++) {
      const date = new Date(todayy);
      date.setDate(date.getDate() + i);
      const dateString = date.toISOString().split("T")[0];
      dates.push({ date: dateString, indent: i });
    }

    return NextResponse.json(
      {
        date: date_,
        datee: dates,
        games: oddLst.length === 0 && sGames ? sGames.games : oddLst,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Unexpected server error",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    );
  }
}
