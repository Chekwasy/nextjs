import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
      const today = new Date();
      const day = today.getDate();
      const hour = today.getHours();
      const minute = today.getMinutes();
      return  NextResponse.json({day: day, hour: hour, minute: minute }, {status: 201});
    } catch {
        return NextResponse.json('error', {status: 400});
    }
};
