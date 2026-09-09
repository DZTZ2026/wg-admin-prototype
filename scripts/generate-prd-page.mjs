import fs from 'node:fs'

const files = {
  'master/scope': 'public/prd-content/master-scope.html',
  'master/open': 'public/prd-content/master-open.html',
  'master/bill': 'public/prd-content/master-bill.html',
  'master/group-change': 'public/prd-content/master-group-change.html',
  'site/scope': 'public/prd-content/site-scope.html',
  'site/dashboard': 'public/prd-content/site-dashboard.html',
  'site/open': 'public/prd-content/site-open.html',
  'site/quota': 'public/prd-content/site-quota.html',
  'site/bill': 'public/prd-content/site-bill.html',
  'site/group-change': 'public/prd-content/site-group-change.html',
  'site/ip-whitelist': 'public/prd-content/site-ip-whitelist.html',
}

const docs = {}
for (const [key, file] of Object.entries(files)) {
  const raw = fs.readFileSync(file, 'utf8')
  const title = raw.match(/data-title="([^"]*)"/)?.[1] || key
  const sub = raw.match(/data-sub="([^"]*)"/)?.[1] || ''
  const inner = raw.replace(/^<div[^>]*>/, '').replace(/<\/div>\s*$/, '')
  docs[key] = { title, sub, html: inner }
}

const docsJson = JSON.stringify(docs).replace(/</g, '\\u003c')
const shell = fs.readFileSync('public/prd.html', 'utf8')
const next = shell.replace(
  /<script>[\s\S]*<\/script>\s*<\/body>/,
  `<script>
    const DOCS = ${docsJson};
    const MODULES_BY_SIDE = {
      master: [
        { id: 'scope', label: '菜单范围' },
        { id: 'open', label: '开站管理' },
        { id: 'bill', label: '站点账单' },
        { id: 'group-change', label: '集团账变' },
      ],
      site: [
        { id: 'scope', label: '菜单范围' },
        { id: 'dashboard', label: '仪表盘' },
        { id: 'open', label: '开站管理' },
        { id: 'quota', label: '额度管理' },
        { id: 'bill', label: '站点账单' },
        { id: 'group-change', label: '集团账变' },
        { id: 'ip-whitelist', label: 'IP白名单' },
      ],
    };

    function modules(side) {
      return MODULES_BY_SIDE[side] || MODULES_BY_SIDE.master;
    }

    function parseRoute() {
      const hash = location.hash.replace(/^#\\/?/, '');
      const m = hash.match(/^(master|site)\\/([\\w-]+)/);
      if (!m) return null;
      const side = m[1];
      const mod = m[2];
      if (modules(side).some((item) => item.id === mod)) {
        return { side, mod };
      }
      return { side, mod: modules(side)[0].id };
    }

    function dest(side, mod) {
      return '/prd.html#' + side + '/' + mod;
    }

    function current() {
      return parseRoute() || { side: 'master', mod: modules('master')[0].id };
    }

    function apply(side, mod) {
      const list = modules(side);
      const safeMod = list.some((item) => item.id === mod) ? mod : list[0].id;
      document.documentElement.dataset.side = side;
      document.querySelectorAll('#sideSwitch button').forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.side === side);
      });
      document.getElementById('moduleNav').innerHTML = list.map(
        (m) => '<a href="' + dest(side, m.id) + '" class="' + (m.id === safeMod ? 'active' : '') + '">' + m.label + '</a>'
      ).join('');
      const doc = DOCS[side + '/' + safeMod];
      if (!doc) {
        document.getElementById('article').innerHTML = '<p class="prd-empty">未找到文档</p>';
        return;
      }
      document.title = doc.title;
      document.getElementById('docTitle').textContent = doc.title;
      document.getElementById('docSub').textContent = doc.sub;
      document.getElementById('article').innerHTML = doc.html;
      document.getElementById('article').querySelectorAll('a[href^="#s"]').forEach((a) => {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const el = document.getElementById((a.getAttribute('href') || '').slice(1));
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      window.scrollTo(0, 0);
    }

    document.getElementById('sideSwitch').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-side]');
      if (!btn) return;
      const side = btn.dataset.side;
      const cur = current().mod;
      const nextMod = modules(side).some((item) => item.id === cur) ? cur : modules(side)[0].id;
      location.href = dest(side, nextMod);
    });
    window.addEventListener('hashchange', () => {
      const route = parseRoute();
      if (!route) return;
      apply(route.side, route.mod);
    });
    if (!location.hash || !parseRoute()) {
      history.replaceState(null, '', dest('master', modules('master')[0].id));
    }
    apply(current().side, current().mod);
  </script>
</body>`,
)

fs.writeFileSync('public/prd.html', next)
console.log('wrote public/prd.html', next.length)
