# RainMaker — Go-live comercial

Legenda: `[ ]` pendente · `[x]` feito · `[~]` parcial · `[!]` precisa de você  
Supabase Pro: **resolvido**.

Atualizado: **2026-10-08**

---

## Diagnóstico (hoje)

| Item | Status |
|------|--------|
| Site `www.rainmaker.ia.br` | ✅ no ar |
| Supabase prod | ✅ ACTIVE_HEALTHY + Pro |
| Base empresas | ✅ nacional (~28M / 27 UFs) |
| Stripe price **mensal** em prod | ✅ |
| Stripe price **anual** em prod | ❌ ainda não (`billing:setup --live`) |
| Código billing anual (toggle + checkout) | ✅ no working tree · **não commitado / não deployado** |
| Deploy Vercel com código novo | ❌ prod ainda serve build antigo |
| Env Vercel (Stripe live, Resend, Groq) | `[!]` confirmar no dashboard |
| Smoke 8/8 | `[ ]` |

---

## O que já está pronto (não bloqueia)

- CRM: funil, agenda, contatos, dashboard  
- Empresas / CNPJ + cotas  
- RainMaker IA + enforcement de cota  
- Billing mensal (código) + trial 14d  
- Equipe (convite / limite)  
- Billing anual no **código** (test mode já tem prices no staging)

---

## O que falta para a versão final

### Bloqueadores (ordem)

| # | Item | Quem |
|---|------|------|
| 1 | **Commit + deploy** do billing anual e demais mudanças locais | Agente / você |
| 2 | `npm run billing:setup -- --live` → gravar prices anuais no `ceobrain-prod` | Agente (com keys live) |
| 3 | Confirmar env **Vercel Production** (Stripe live, webhook, Resend, Groq, APP_URL) | Você |
| 4 | Smoke produção 8 passos (cadastro → assinar → UF → e-mail → IA → cancelar) | Você + agente |
| 5 | Piloto 1–3 usuários → soft launch | Você |

### Importante, mas pode ser dia 2

- Onboarding: escolher UF após cadastro  
- Remover membro (ou “via suporte” no lançamento)  
- Atalho WhatsApp `wa.me`  
- Billing timeout fail-closed no middleware  

### Fora da v1

- WhatsApp Cloud API  
- App `.exe`  
- CI / CSP / rate limit  

---

## Próximo passo imediato

**1. Publicar o que já está pronto** — commit das mudanças de billing anual + deploy na Vercel.

**2. Em seguida:** `billing:setup --live` + checagem das env de produção.

Sem o deploy, o site continua sem toggle anual e sem o código novo — mesmo com a base e o Supabase ok.
