import { useEffect, useMemo } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import masterOpenHtml from './html/master-open.html?raw'
import siteOpenHtml from './html/site-open.html?raw'
import masterBillHtml from './html/master-bill.html?raw'
import siteBillHtml from './html/site-bill.html?raw'
import './prd.css'

type PrdSide = 'master' | 'site'

/** 后续加模块：在此追加一项，并在 html/ 下放好 master / site 两份文档 */
const MODULES = [
  { id: 'open', label: '开站管理', master: masterOpenHtml, site: siteOpenHtml },
  { id: 'bill', label: '站点账单', master: masterBillHtml, site: siteBillHtml },
] as const

const LINK_MAP: Record<string, string> = {
  'master-site-open-prd.html': '/prd/master/open',
  'merchant-site-open-prd.html': '/prd/site/open',
  'site-open-prd.html': '/prd/master/open',
  'master-site-bill-prd.html': '/prd/master/bill',
  'merchant-site-bill-prd.html': '/prd/site/bill',
}

function extractDoc(html: string, fallbackTitle: string) {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  parsed.querySelectorAll('script').forEach((node) => node.remove())
  const title = parsed.querySelector('h1')?.textContent?.trim() || fallbackTitle
  const sub = parsed.querySelector('header p')?.textContent?.trim() || ''
  const article = document.createElement('div')
  article.innerHTML = parsed.querySelector('main')?.innerHTML || '<p class="prd-empty">未找到文档内容</p>'
  article.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || ''
    const file = href.split('/').pop() || ''
    if (LINK_MAP[file]) a.setAttribute('href', LINK_MAP[file])
  })
  return { title, sub, articleHtml: article.innerHTML }
}

export default function PrdPage() {
  const navigate = useNavigate()
  const splat = useParams()['*'] || ''
  const parts = splat.split('/').filter(Boolean)
  const side: PrdSide = parts[0] === 'site' ? 'site' : 'master'
  const mod = MODULES.some((m) => m.id === parts[1]) ? parts[1] : MODULES[0].id
  const canonical = `${side}/${mod}`
  const item = MODULES.find((m) => m.id === mod) || MODULES[0]
  const doc = useMemo(() => extractDoc(item[side], item.label), [item, side])

  useEffect(() => {
    document.title = doc.title
  }, [doc.title])

  if (splat !== canonical) {
    return <Navigate to={`/prd/${canonical}`} replace />
  }

  const go = (nextSide: PrdSide, nextMod: string) => {
    navigate(`/prd/${nextSide}/${nextMod}`)
  }

  return (
    <div className="prd-page" data-side={side}>
      <header className="prd-top">
        <div className="prd-brand">包网后台开发 PRD</div>
        <div className="prd-switch">
          <button type="button" className={side === 'master' ? 'active' : ''} onClick={() => go('master', mod)}>
            总控 PRD
          </button>
          <button type="button" className={side === 'site' ? 'active' : ''} onClick={() => go('site', mod)}>
            站点 PRD
          </button>
        </div>
        <div className="prd-top-links">
          <Link to="/">站点原型</Link>
          <Link to="/master">总控原型</Link>
        </div>
      </header>
      <div className="prd-layout">
        <aside className="prd-side">
          <div className="prd-side-label">模块</div>
          <nav>
            {MODULES.map((m) => (
              <Link key={m.id} to={`/prd/${side}/${m.id}`} className={m.id === mod ? 'active' : ''}>
                {m.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="prd-main">
          <div className="prd-doc-title">
            <h1>{doc.title}</h1>
            <p>{doc.sub}</p>
          </div>
          <div className="prd-article" dangerouslySetInnerHTML={{ __html: doc.articleHtml }} />
        </div>
      </div>
    </div>
  )
}
