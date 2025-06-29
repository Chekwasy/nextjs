import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
      const today = new Date();
      const hour = today.getHours();
      const minute = today.getMinutes();
      return  NextResponse.json({hour: hour, minute: minute }, {status: 201});
    } catch {
        return NextResponse.json('error', {status: 400});
    }
};
