import { NextResponse } from 'next/server';

export async function GET() {
    try {
      const today = new Date();
      const hour = today.getHours();
      const minute = today.getMinutes();
      const day = today.getDate();
      const month = today.getMonth();
      const year = today.getFullYear();
      return  NextResponse.json({hour: hour, minute: minute, day: day, month: month, year: year }, {status: 201});
    } catch {
        return NextResponse.json('error', {status: 400});
    }
};
