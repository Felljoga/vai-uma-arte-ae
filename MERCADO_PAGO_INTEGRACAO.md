# 💳 Integração com Mercado Pago - VAI UMA ARTE AÊ?!

## 📋 Visão Geral

Esta integração usa **Links de Pagamento do Mercado Pago** + **Pipedream (gratuito)** para webhooks.
É uma solução 100% gratuita que não requer Cloud Functions.

---

## 🔧 PASSO 1: Criar Links de Pagamento no Mercado Pago

### Acesse o painel do Mercado Pago
1. Entre em: https://www.mercadopago.com.br/tools/create
2. Ou acesse: Seu Negócio → Link de pagamento → Criar link

### Crie 6 links (3 planos x 2 ciclos):

#### 🔵 Plano Pro Mensal
- **Título:** VAI UMA ARTE AÊ - Plano Pro Mensal
- **Preço:** R$ 19,90
- **Descrição:** Plano Pro com 5 pedidos/mês, suporte prioritário, 3 revisões
- **Copie o link gerado**

#### 🔵 Plano Pro Anual
- **Título:** VAI UMA ARTE AÊ - Plano Pro Anual
- **Preço:** R$ 199,00
- **Descrição:** Plano Pro Anual - Economize 20%!
- **Copie o link gerado**

#### 🟣 Plano Studio Mensal
- **Título:** VAI UMA ARTE AÊ - Plano Studio Mensal
- **Preço:** R$ 49,90
- **Descrição:** Plano Studio com 15 pedidos/mês, suporte VIP, 5 revisões
- **Copie o link gerado**

#### 🟣 Plano Studio Anual
- **Título:** VAI UMA ARTE AÊ - Plano Studio Anual
- **Preço:** R$ 499,00
- **Descrição:** Plano Studio Anual - Economize 20%!
- **Copie o link gerado**

#### 🟠 Plano Empresa Mensal
- **Título:** VAI UMA ARTE AÊ - Plano Empresa Mensal
- **Preço:** R$ 99,90
- **Descrição:** Plano Empresa com pedidos ilimitados, gerente dedicado
- **Copie o link gerado**

#### 🟠 Plano Empresa Anual
- **Título:** VAI UMA ARTE AÊ - Plano Empresa Anual
- **Preço:** R$ 999,00
- **Descrição:** Plano Empresa Anual - Economize 20%!
- **Copie o link gerado**

---

## ✅ Links Configurados

Os links de pagamento já estão configurados no código:

| Plano | Ciclo | Link |
|-------|-------|------|
| **Pro** | Mensal | https://mpago.la/1553P8o |
| **Pro** | Anual | https://mpago.la/2mc8g5k |
| **Studio** | Mensal | https://mpago.la/1eMxopE |
| **Studio** | Anual | https://mpago.la/1v4sqWH |
| **Empresa** | Mensal | https://mpago.la/2zLiwsR |
| **Empresa** | Anual | https://mpago.la/297riMr |

```typescript
// Já configurado em src/services/payment.ts
export const PAYMENT_LINKS = {
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
```

---

## 🔧 PASSO 3: Configurar Webhook com Pipedream (GRATUITO)

O Pipedream é uma plataforma gratuita que vai receber as notificações do Mercado Pago e atualizar o Firebase automaticamente.

### 3.1 Criar conta no Pipedream
1. Acesse: https://pipedream.com
2. Crie uma conta gratuita

### 3.2 Criar novo Workflow
1. Clique em "New Workflow"
2. Escolha "HTTP / Webhook" como trigger
3. Copie a URL do webhook gerado (algo como: `https://xxxxxx.m.pipedream.net`)

### 3.3 Configurar o Webhook no Mercado Pago
1. Acesse: https://www.mercadopago.com.br/developers/panel/app
2. Selecione sua aplicação ou crie uma
3. Vá em "Webhooks" → "Configurar notificações"
4. Cole a URL do Pipedream
5. Selecione os eventos: `payment`
6. Salve

### 3.4 Adicionar os Steps no Pipedream

Adicione um step "Run Node.js code" com o seguinte código:

```javascript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

export default defineComponent({
  async run({ steps, $ }) {
    // Dados do webhook
    const data = steps.trigger.event.body;
    
    // Apenas processar pagamentos aprovados
    if (data.action !== 'payment.created' && data.action !== 'payment.updated') {
      return { status: 'ignored', action: data.action };
    }

    // ID do pagamento
    const paymentId = data.data?.id;
    if (!paymentId) {
      return { status: 'no_payment_id' };
    }

    // Buscar detalhes do pagamento no Mercado Pago
    const ACCESS_TOKEN = 'APP_USR-8444792062939084-022218-07558c743fca3f5fe8421e82bca36abe-266616017';
    
    const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`
      }
    });
    
    const payment = await paymentResponse.json();
    
    // Verificar se foi aprovado
    if (payment.status !== 'approved') {
      return { status: 'not_approved', paymentStatus: payment.status };
    }

    // Pegar o external_reference (sessionId)
    const sessionId = payment.external_reference;
    if (!sessionId) {
      return { status: 'no_session_id' };
    }

    // Inicializar Firebase (cole suas credenciais do Firebase Admin SDK)
    // Você pode obter essas credenciais em:
    // Firebase Console → Configurações do Projeto → Contas de Serviço → Gerar nova chave privada
    
    const serviceAccount = {
      type: "service_account",
      project_id: "vai-uma-arte-ae-b27ed",
      // COLE AQUI AS OUTRAS CREDENCIAIS DO SERVICE ACCOUNT
    };

    let app;
    try {
      app = initializeApp({
        credential: cert(serviceAccount)
      });
    } catch (e) {
      // App já inicializado
    }

    const db = getFirestore();

    // Buscar sessão de pagamento
    const sessionDoc = await db.collection('payment_sessions').doc(sessionId).get();
    
    if (!sessionDoc.exists) {
      return { status: 'session_not_found', sessionId };
    }

    const session = sessionDoc.data();

    // Atualizar sessão para concluída
    await db.collection('payment_sessions').doc(sessionId).update({
      status: 'completed',
      paymentId: paymentId.toString(),
      completedAt: new Date()
    });

    // Calcular data de expiração
    const now = new Date();
    const expiresAt = new Date(now);
    if (session.billingCycle === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    // Atualizar usuário com o novo plano
    await db.collection('users').doc(session.userId).update({
      plan: session.planId,
      planName: session.planName,
      billingCycle: session.billingCycle,
      planActivatedAt: new Date(),
      planExpiresAt: expiresAt,
      'subscription.status': 'active',
      'subscription.planId': session.planId,
      'subscription.billingCycle': session.billingCycle,
      'subscription.currentPeriodEnd': expiresAt
    });

    // Registrar transação
    await db.collection('transactions').doc(`tx_${session.userId}_${Date.now()}`).set({
      userId: session.userId,
      planId: session.planId,
      planName: session.planName,
      billingCycle: session.billingCycle,
      amount: payment.transaction_amount,
      status: 'completed',
      paymentMethod: 'mercadopago',
      paymentId: paymentId.toString(),
      createdAt: new Date()
    });

    return { 
      status: 'success', 
      userId: session.userId, 
      planId: session.planId,
      paymentId 
    };
  }
});
```

### 3.5 Configurar Firebase Admin no Pipedream

1. Vá para Firebase Console → Configurações do projeto → Contas de serviço
2. Clique em "Gerar nova chave privada"
3. Baixe o arquivo JSON
4. No Pipedream, adicione as credenciais no código acima (serviceAccount)

---

## 🔧 ALTERNATIVA MAIS SIMPLES: Ativação Manual

Se preferir não usar webhook, você pode ativar os planos manualmente:

### No Painel Admin do site:
1. Faça login com a conta de dono (wandersonsilvasantos2@gmail.com)
2. Abra o Painel Admin
3. Procure o usuário que pagou
4. Clique em "Ativar Plano"
5. Selecione o plano correto

### Ou diretamente no Firebase Console:
1. Acesse: https://console.firebase.google.com
2. Vá em Firestore Database
3. Encontre o usuário em `users/{userId}`
4. Edite os campos:
   - `plan`: "pro", "studio" ou "agency"
   - `planName`: "Pro", "Studio" ou "Empresa"
   - `planExpiresAt`: Data de expiração (30 dias ou 1 ano à frente)

---

## 📱 URLs de Retorno

Configure estas URLs no Mercado Pago (se disponível):

- **Sucesso:** `https://seu-dominio.com/#/pagamento/sucesso?session={external_reference}`
- **Falha:** `https://seu-dominio.com/#/pagamento/erro`
- **Pendente:** `https://seu-dominio.com/#/pagamento/pendente?session={external_reference}`

---

## ✅ Checklist Final

- [ ] Criar 6 links de pagamento no Mercado Pago
- [ ] Atualizar `src/services/payment.ts` com os links
- [ ] (Opcional) Configurar Pipedream para webhook automático
- [ ] (Opcional) Gerar chave do Firebase Admin SDK
- [ ] Testar um pagamento

---

## 🧪 Testando

1. Clique em "Assinar Agora" em qualquer plano
2. Será aberta uma nova aba com o link do Mercado Pago
3. Complete o pagamento
4. Aguarde a ativação (automática via webhook ou manual)

---

## 💡 Dicas

- **PIX é instantâneo:** O webhook é chamado imediatamente
- **Cartão:** Geralmente aprovado em segundos
- **Boleto:** Pode demorar 1-3 dias úteis

---

## 🆘 Suporte

Se tiver dúvidas, entre em contato pelo Instagram: @vaiumaarteaeofc
