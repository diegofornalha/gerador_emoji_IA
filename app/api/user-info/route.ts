import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function GET() {
  const { userId } = auth();
  
  if (!userId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    
    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0]?.emailAddress,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt,
    };

    return NextResponse.json({ success: true, user: userData });
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar dados do usuário' }, 
      { status: 500 }
    );
  }
} 