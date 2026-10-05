"use client"

import { useEffect } from "react"

// Carrega os embeds de terceiro em tres camadas, por ordem de importancia para
// o negocio, em vez de tudo de uma vez durante a pintura inicial.
//
//   Camada 1 (1200ms ou primeira interacao): form_embed.js, que redimensiona o
//     iframe do formulario, e o gtag.js do GA4. O formulario em si NAO passa
//     por aqui — ele vem com src direto no HTML em todas as 1.003 paginas, e
//     assim deve continuar: data/company.json .ghl._loadingNote registra que
//     adia-lo ja parou a captacao de leads (4c9fe8d43, revertido em 46d430cc4).
//
//   Camada 2 (so com toque, clique ou tecla): a bolha de chat. Era a maior
//     long task da home no Lighthouse, 912 ms, mais um avatar de 594 KB, e
//     carregava para todo mundo mesmo sem ninguem querer conversar.
//
//   Camada 3 (ao chegar perto da tela): o widget de avaliacoes, que fica no pe
//     da home e da /reviews.
//
// gtag() ja esta definido pelo stub em layout.tsx <head>, entao os eventos
// ficam na fila ate o gtag.js chegar.
export default function LazyEmbeds() {
  useEffect(() => {
    let done = false
    let timer: ReturnType<typeof setTimeout> | undefined
    // Real intent signals only — NOT mousemove (fires instantly) and NOT a
    // near-viewport observer (the hero form sits high on the page, so it would
    // trigger during the first paint and defeat the whole point).
    const events = ["scroll", "pointerdown", "keydown", "touchstart"] as const

    const cleanup = () => {
      events.forEach((e) => window.removeEventListener(e, onTrigger))
      if (timer) clearTimeout(timer)
    }

    const loadForms = () => {
      document.querySelectorAll<HTMLIFrameElement>("iframe[data-src]").forEach((f) => {
        const ds = f.getAttribute("data-src")
        if (ds) {
          f.setAttribute("src", ds)
          f.removeAttribute("data-src")
        }
      })
    }

    const loadThirdParty = () => {
      if (done) return
      done = true

      // GHL form_embed.js auto-resizes the form iframes to their full content
      // height (otherwise they stay at the fixed 500px and clip the form).
      // Load it BEFORE setting the iframe src so its resize listener is ready.
      if (!document.getElementById("ghl-form-embed")) {
        const fe = document.createElement("script")
        fe.id = "ghl-form-embed"
        fe.src = "https://link.msgsndr.com/js/form_embed.js"
        document.body.appendChild(fe)
      }
      loadForms()

      // O chat e o widget de avaliacoes saiam daqui: viraram as camadas 2 e 3,
      // mais abaixo. O formulario nao foi tocado — ele nem passa por este
      // componente, carrega com src direto no HTML nas 1.003 paginas.

      // GA4 library (config is already queued via the gtag stub in <head>)
      if (!document.getElementById("ga4-lib")) {
        const g = document.createElement("script")
        g.id = "ga4-lib"
        g.async = true
        g.src = "https://www.googletagmanager.com/gtag/js?id=G-2MP9G52LW7"
        document.body.appendChild(g)
      }

      cleanup()
    }

    const onTrigger = () => loadThirdParty()

    // --- Camada 2: bolha de chat ------------------------------------------
    // Era carregada junto com a camada 1, aos 1200ms, em toda pagina e para
    // todo visitante. No Lighthouse ela aparece como a maior long task da
    // pagina (912 ms) e ainda puxa um avatar de 594 KB.
    //
    // Aqui ela passa a esperar um sinal de gente de verdade — toque, clique ou
    // tecla. Sem fallback por tempo e sem "scroll": rolagem acontece em
    // crawler e no proprio Lighthouse, o que anularia o adiamento. Quem quiser
    // conversar toca na pagina e a bolha aparece na hora.
    const sinaisHumanos = ["pointerdown", "keydown", "touchstart"] as const
    let chatFeito = false
    const carregarChat = () => {
      if (chatFeito) return
      chatFeito = true
      if (!document.getElementById("ghl-chat-loader")) {
        const s = document.createElement("script")
        s.id = "ghl-chat-loader"
        s.src = "https://beta.leadconnectorhq.com/loader.js"
        s.setAttribute("data-resources-url", "https://beta.leadconnectorhq.com/chat-widget/loader.js")
        s.setAttribute("data-widget-id", "6a1b542f7645b2ba9a1194ac")
        document.body.appendChild(s)
      }
      sinaisHumanos.forEach((e) => window.removeEventListener(e, carregarChat))
    }
    sinaisHumanos.forEach((e) => window.addEventListener(e, carregarChat, { passive: true }))

    // --- Camada 3: widget de avaliacoes -----------------------------------
    // Fica no fim da home e da /reviews, nunca acima da dobra. Carrega quando
    // esta a 600px de entrar na tela. Um <script> dentro de innerHTML nunca
    // executa — e por isso que ele precisa ser injetado daqui.
    let obs: IntersectionObserver | undefined
    const alvoReviews = document.querySelector(".lc_reviews_widget")
    const carregarReviews = () => {
      if (document.getElementById("lc-reviews-widget")) return
      const rw = document.createElement("script")
      rw.id = "lc-reviews-widget"
      rw.src = "https://reputationhub.site/reputation/assets/review-widget.js"
      document.body.appendChild(rw)
    }
    if (alvoReviews) {
      if ("IntersectionObserver" in window) {
        obs = new IntersectionObserver(
          (entradas) => {
            if (entradas.some((e) => e.isIntersecting)) {
              carregarReviews()
              obs?.disconnect()
            }
          },
          { rootMargin: "600px 0px" }
        )
        obs.observe(alvoReviews)
      } else {
        carregarReviews()
      }
    }

    events.forEach((e) => window.addEventListener(e, onTrigger, { passive: true }))
    // Idle fallback so the form and analytics still appear for passive
    // visitors — short enough that the form feels responsive, but after the
    // initial paint so it doesn't compete with FCP/LCP. First real
    // interaction loads them sooner. O prazo de 1200ms segue intocado: o
    // commit 4c9fe8d43 o apertou de 3,5s para 1,2s por causa de captacao de
    // lead, e data/company.json .ghl._loadingNote proibe afrouxar.
    timer = setTimeout(loadThirdParty, 1200)

    return () => {
      cleanup()
      sinaisHumanos.forEach((e) => window.removeEventListener(e, carregarChat))
      obs?.disconnect()
    }
  }, [])

  return null
}
