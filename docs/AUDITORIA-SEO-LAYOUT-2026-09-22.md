# Auditoria SEO + Layout — doryscleaningservices.com
**Data:** 22/09/2026 · **Branch:** `claude/dorys-seo-layout-audit-q8pzly` · **Escopo:** todas as 1.036 URLs (1.031 páginas + arquivos)

## Resumo executivo

| Indicador | Antes | Depois |
|---|---|---|
| Páginas com schema (JSON-LD) no HTML servido | 0 de 956 | **1.031 de 1.031** |
| Links internos que passavam por redirect 301 | ~4.100 | **0** |
| URLs no sitemap | 912 (4 redirecionavam, 3 hubs faltando) | **1.031, todas 200 e indexáveis** |
| Similaridade páginas serviço×cidade (mesmo serviço) | 93% | **23%** (mediana) |
| Similaridade páginas de cidade (/locations) | 44% | **26%** |
| 7 páginas raiz (cardiologia, diálise, cirurgia, emergência, COVID, ATP, facilities) | 98–99% idênticas | **~40%** |
| Posts do blog duplicados | 2 (98% iguais a outro post) | **0** (máx. 7%) |
| Títulos > 60 caracteres | 803 | **0** |
| Descrições > 160 caracteres | 303 | **0**  |
| Páginas de cidade órfãs (sem link interno) | 28 | **0** |
| Páginas com rolagem horizontal no mobile | 0 | 0 |
| Lighthouse (mobile) — SEO | — | **100** em todos os templates |
| Lighthouse — Performance / Acessibilidade | — | **90–94 / 96–100**, CLS 0 |

## 1. SEO técnico corrigido
- **Schema invisível:** `next/script` só injetava o JSON-LD depois do JavaScript; Bing e robôs de IA não viam nada. Agora o schema vai no HTML (`lib/ld-json.ts`).
- **148 FAQPage com perguntas que não aparecem na página** (dados estruturados ocultos, risco de ação manual): removidas; FAQs refeitas a partir do conteúdo visível.
- **109 entidades LocalBusiness duplicadas** (uma por cidade com o endereço de Marlborough) e tipo errado `HealthAndBeautyBusiness`: removidos. Uma empresa, um `@id`.
- **Credenciais falsas no schema da Home:** licença HIC (cliente pediu remoção) + 3 "certificações" sem comprovante: removidas.
- **robots.txt:** os blocos de Googlebot/Bingbot faziam esses robôs ignorarem todos os `Disallow`. Corrigido.
- **Sitemap:** gerado dos dados, sem redirects, com `lastmod` do histórico do git (antes mudava a cada deploy).
- **Links para noindex/redirects**, menu e rodapé com links errados, hubs sem link para as páginas de cidade: corrigidos (`scripts/fix-internal-redirect-links.mjs`, `scripts/relink-service-pages.mjs`).

## 2. Erros factuais e alegações sem prova (corrigidos)
| Onde | Problema | Correção |
|---|---|---|
| 14 páginas | "105 CMR 451 = código sanitário de saúde" — **é o regulamento de presídios** | Trocado por 105 CMR 140/150 (licença de clínicas e casas de repouso) |
| 14 páginas | "EPA List H = Candida auris" | É **List P** (List H = MRSA/VRE) |
| 111 lugares | "Equipe **certificada** em patógenos" | "Treinada" (OSHA é treinamento; não há certificado registrado) |
| Home | "50+ healthcare facilities served" | Sem fonte (`facilitiesServed: null`) → trocado por "109 cidades" |
| About | Contadores exibiam **0** no HTML; alvo "100+ cidades" e **nota 5** | Valores reais: 22+, 109, $2M, **4.7** |
| FAQ | "Atende Boston", "296 cidades", licença HIC, "melhor empresa", nota "para IAs" | Reescrito com dados reais; Boston **não** está na rota padrão |
| /locations | "296 cidades", "21+ anos", "preços locais, depoimentos, **casas**" | 109 cidades, 22+, só instalações de saúde |
| llms.txt / ai.txt | Diziam às IAs que atende **Boston, Springfield, Fall River, Cape Cod** | Lista gerada das 109 cidades reais |
| Guia MA | "Atende Berkshires e Cape Cod" | Removido |
| ATP | "3 Spots Left This Month" (escassez falsa) | Removido |
| Títulos | "Sterile environment" (limpeza não esteriliza) | Corrigido |
| 109 páginas | "Massachusetts County" (condado inexistente), "medical waste handling", "terminal cleaning between patients" | Corrigidos |

## 3. Conteúdo reconstruído (sem retirar nenhuma página)
Todas as 872 páginas serviço×cidade e as 109 de cidade são geradas de **dados com fonte**:
- **U.S. Census Bureau** (Gazetteer): área de terra e água, forma de município, coordenadas — `data/geo/`, `scripts/build-city-geo.mjs`
- **Censo 2020** (população), **CEPs (USPS)**, condado, região
- **Calculado:** densidade, distância e direção da sede em Marlborough, cidades vizinhas atendidas
- **Estabelecimentos verificados** relevantes para o serviço (ou o polo hospitalar da cidade, ou a cidade vizinha mais próxima que tem)
- **Base técnica por serviço** (`scripts/data/service-knowledge.json`): zonas de alto contato, protocolo, frequência, documentação, perguntas ao fornecedor — cada página mostra uma seleção diferente
- **FAQ local** com schema

Pipeline: `npm run build:service-pages` (merge → páginas de serviço → páginas de cidade → religação → sitemaps).

## 4. Layout corrigido
- Mobile: H1 (16–19 px) menor que o texto (17 px) em ~950 páginas; botões com 11,9 px → escala nova.
- Marcadores das listas invisíveis em todo o site; logo do header ilegível; logo do rodapé = caixa branca vazia.
- Blog: H1 escuro sobre azul, breadcrumb invisível; tabela estourando no mobile.
- Grid `.two-col` cortando texto no mobile; blocos aninhados em /locations; estatísticas invisíveis em Reviews; cards sem padding em Supplier Diversity; botão flutuante cobrindo títulos no desktop.
- Contato: formulário estava a ~1.900 px de rolagem no celular → subiu para o topo.
- Acessibilidade: contraste de textos cinza e do CTA azul, alvos de toque de 24 px, abas da galeria viraram `<button>`.

## 5. Rodada final ("fazer tudo, sem reduzir páginas")
- **CSS unificado:** 5 arquivos bloqueantes → 1 (`site.min.css`, 248 KB → 170 KB), gerado por `npm run build:css`. Teste de regressão: 14 templates × 2 larguras **idênticos pixel a pixel** ao build anterior.
- **Autoridade de saúde local nas 109 cidades:** nome e link da página oficial do Board of Health / Health Department (domínio da própria prefeitura), exibidos nas 981 páginas de cidade com uma FAQ explicando DPH × board local. Telefones **não** publicados até confirmação.
- **Hubs de serviço:** cada um dos 8 hubs agora traz o protocolo completo (todas as zonas, passos, frequência, documentação, perguntas ao fornecedor).
- **Blog → serviços:** 17 de 20 posts não linkavam nenhum hub; agora os 20 têm o bloco "Where this applies".
- **Supplier Diversity:** documentos para compras (COI, W-9, NAICS, SDS, treinamentos), nota honesta de que o gasto só conta como MBE/WBE após a certificação, cobertura multi-site; removido "hospitais".

## 6. Pendências (precisam de ação humana)
1. **Telefones dos Boards of Health** — os links oficiais já estão no ar; os telefones ficam em `data/_todo-boards-of-health.csv` até alguém confirmar (**Ana/Gabi**). Depois, preencher `localHealth.boardOfHealthPhone` em `data/cities/*.json` e rodar `npm run build:service-pages`.
2. **Estabelecimentos por cidade** — dental não tem nenhum consultório verificado; várias cidades pequenas não têm nenhum estabelecimento. Pesquisar e adicionar em `healthcareLandscape.majorFacilities` (com fonte) aumenta o valor local das páginas automaticamente.
3. **Selos MBE/WBE** — só usar as siglas quando houver número de certificado em `data/company.json`.
4. **Depois do deploy:** reenviar `sitemap.xml` no Google Search Console e acompanhar a cobertura das 1.031 URLs por 4–6 semanas.
5. **CSS não usado** — o bundle ainda carrega regras de templates antigos; remover exige mapear classes geradas por JS. Próximo ganho de performance, com teste visual a cada passo.
