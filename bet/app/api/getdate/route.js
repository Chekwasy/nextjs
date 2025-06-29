import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
      const today = new Date();
      const day = today.getDate().toString().padStart(2, '0');
      const hour = today.getHours();
      const minute = today.getMinutes();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear().toString();
      return  NextResponse.json({year: year, month: month, day: day, hour: hour, minute: minute }, {status: 201});
    } catch {
        return NextResponse.json('error', {status: 400});
    }
};
