// ============================================
// SISTEMA DE PAGAMENTO - VAI UMA ARTE AÊ?!
// Usando Links de Pagamento do Mercado Pago
// 100% Gratuito - Sem Cloud Functions
// ============================================

import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Configuração dos Planos
export const PLANS = {
  free: {
    id: 'free',
    name: 'Grátis',
    price: 0,
    priceYearly: 0,
    features: ['1 pedido por mês', 'Suporte por email', 'Acesso à comunidade'],
    limits: { ordersPerMonth: 1, revisions: 1 }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.90,
    priceYearly: 199.00,
    features: ['5 pedidos por mês', 'Suporte prioritário', 'Acesso à comunidade', '3 revisões por pedido', 'Entrega em 48h'],
    limits: { ordersPerMonth: 5, revisions: 3 }
  },
  studio: {
    id: 'studio',
    name: 'Studio',
    price: 49.90,
    priceYearly: 499.00,
    features: ['15 pedidos por mês', 'Suporte VIP 24h', 'Acesso à comunidade', '5 revisões por pedido', 'Entrega em 24h', 'Arquivos editáveis'],
    limits: { ordersPerMonth: 15, revisions: 5 }
  },
  agency: {
    id: 'agency',
    name: 'Empresa',
    price: 99.90,
    priceYearly: 999.00,
    features: ['Pedidos ilimitados', 'Gerente dedicado', 'Acesso à comunidade', 'Revisões ilimitadas', 'Entrega expressa', 'Arquivos editáveis', 'Licença comercial total'],
    limits: { ordersPerMonth: 999, revisions: 999 }
  }
};

// ============================================
// LINKS DE PAGAMENTO DO MERCADO PAGO
// Você vai criar esses links no painel do MP
// e colar aqui
// ============================================

export const PAYMENT_LINKS: Record<string, { monthly: string; yearly: string }> = {
  pro: {
    monthly: 'https://mpago.la/1553P8o',
    yearly: 'https://mpago.la/2mc8g5k'
  },
  studio: {
    monthly: 'https://mpago.la/1eMxopE',
    yearly: 'https://mpago.la/1v4sqWH'
  },
  agency: {
    monthly: 'https://mpago.la/2zLiwsR',
    yearly: 'https://mpago.la/297riMr'
  }
};

// Criar sessão de pagamento antes de redirecionar
export async function createPaymentSession(
  userId: string,
  userEmail: string,
  planId: string,
  billingCycle: 'monthly' | 'yearly'
): Promise<string> {
  const plan = PLANS[planId as keyof typeof PLANS];
  if (!plan || planId === 'free') {
    throw new Error('Plano inválido');
  }

  const sessionId = `session_${userId}_${planId}_${Date.now()}`;
  const price = billingCycle === 'yearly' ? plan.priceYearly : plan.price;

  // Salvar sessão no Firebase
  await setDoc(doc(db, 'payment_sessions', sessionId), {
    sessionId,
    userId,
    userEmail,
    planId,
    planName: plan.name,
    billingCycle,
    amount: price,
    status: 'pending',
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
  });

  return sessionId;
}

// Verificar e ativar plano manualmente (para admin)
export async function activatePlanManually(
  userId: string,
  planId: string,
  billingCycle: 'monthly' | 'yearly',
  paymentId?: string
): Promise<void> {
  const plan = PLANS[planId as keyof typeof PLANS];
  if (!plan) {
    throw new Error('Plano inválido');
  }

  const now = new Date();
  const expiresAt = new Date(now);
  
  if (billingCycle === 'yearly') {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }

  // Atualizar usuário
  await updateDoc(doc(db, 'users', userId), {
    plan: planId,
    planName: plan.name,
    billingCycle,
    planActivatedAt: serverTimestamp(),
    planExpiresAt: expiresAt,
    'subscription.status': 'active',
    'subscription.planId': planId,
    'subscription.billingCycle': billingCycle,
    'subscription.currentPeriodEnd': expiresAt
  });

  // Registrar transação
  await setDoc(doc(db, 'transactions', `tx_${userId}_${Date.now()}`), {
    userId,
    planId,
    planName: plan.name,
    billingCycle,
    amount: billingCycle === 'yearly' ? plan.priceYearly : plan.price,
    status: 'completed',
    paymentMethod: 'mercadopago',
    paymentId: paymentId || 'manual',
    createdAt: serverTimestamp()
  });

  // Adicionar conquista
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    const userData = userDoc.data();
    const achievements = userData.achievements || [];
    
    if (!achievements.includes('subscriber')) {
      achievements.push('subscriber');
      await updateDoc(doc(db, 'users', userId), {
        achievements,
        xp: (userData.xp || 0) + 500
      });
    }
  }
}

// Verificar se o plano está ativo
export async function checkPlanStatus(userId: string): Promise<{
  isActive: boolean;
  plan: string;
  expiresAt: Date | null;
}> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  
  if (!userDoc.exists()) {
    return { isActive: false, plan: 'free', expiresAt: null };
  }

  const userData = userDoc.data();
  const plan = userData.plan || 'free';
  const expiresAt = userData.planExpiresAt?.toDate() || null;

  if (plan === 'free') {
    return { isActive: true, plan: 'free', expiresAt: null };
  }

  if (expiresAt && expiresAt < new Date()) {
    // Plano expirado, reverter para free
    await updateDoc(doc(db, 'users', userId), {
      plan: 'free',
      planName: 'Grátis',
      'subscription.status': 'expired'
    });
    return { isActive: false, plan: 'free', expiresAt: null };
  }

  return { isActive: true, plan, expiresAt };
}

// Buscar sessões pendentes de um usuário
export async function getPendingSessions(userId: string) {
  const q = query(
    collection(db, 'payment_sessions'),
    where('userId', '==', userId),
    where('status', '==', 'pending')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Cancelar sessão
export async function cancelSession(sessionId: string) {
  await updateDoc(doc(db, 'payment_sessions', sessionId), {
    status: 'cancelled',
    cancelledAt: serverTimestamp()
  });
}

// Confirmar pagamento (chamado pelo webhook ou admin)
export async function confirmPayment(
  sessionId: string,
  paymentId: string
): Promise<void> {
  const sessionDoc = await getDoc(doc(db, 'payment_sessions', sessionId));
  
  if (!sessionDoc.exists()) {
    throw new Error('Sessão não encontrada');
  }

  const session = sessionDoc.data();
  
  // Atualizar sessão
  await updateDoc(doc(db, 'payment_sessions', sessionId), {
    status: 'completed',
    paymentId,
    completedAt: serverTimestamp()
  });

  // Ativar plano
  await activatePlanManually(
    session.userId,
    session.planId,
    session.billingCycle,
    paymentId
  );
}

// Gerar link de pagamento com external_reference
export function getPaymentLink(
  planId: string,
  billingCycle: 'monthly' | 'yearly',
  sessionId: string
): string {
  const links = PAYMENT_LINKS[planId];
  if (!links) {
    throw new Error('Plano não encontrado');
  }

  const baseLink = billingCycle === 'yearly' ? links.yearly : links.monthly;
  
  // Adiciona o sessionId como parâmetro para rastreamento
  // O Mercado Pago vai incluir isso na notificação do webhook
  return `${baseLink}?external_reference=${sessionId}`;
}
