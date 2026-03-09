import { SITE_URL } from '../lib/config.ts'
import { baseLayout } from '../lib/template.ts'
import { write } from '../lib/utils.ts'

export function buildBio(): void {
  const out = baseLayout({
    title: 'chroju.dev/bio',
    siteTitle: 'chroju.dev/bio',
    ogImage: 'https://og-image.chroju.dev/bio.png?theme=dark&md=0&fontSize=75px',
    ogUrl: `${SITE_URL}/bio`,
    body: `
<h2>chroju</h2>
<img src="/images/profile.webp" class="my-10 w-20 rounded-full" width="80" height="80" alt="chroju" />
<article class="bio">
  <dl>
    <dt>Job</dt><dd>Site Reliability Engineer</dd>
    <dt>Location</dt><dd>Kanagawa, Japan</dd>
    <dt>Favorite</dt><dd>Terraform / Kubernetes / Go / AWS</dd>
  </dl>
  <h2>Experience</h2>
  <dl>
    <dt>GLOBIS Corporation</dt><dd>Site Reliability Engineer</dd><dd>Apr 2020 - current</dd>
    <dt>Freelancer</dt><dd>Site Reliability Engineer</dd><dd>Jun 2019 - Mar 2020</dd>
    <dt>Quants Research Inc.</dt><dd>Web Operation Engineer</dd><dd>Jun 2015 - May 2019</dd>
    <dt>TIS Inc.</dt><dd>System Engineer</dd><dd>Apr 2011 - May 2015</dd>
  </dl>
  <h2>Education</h2>
  <dl>
    <dt>Bachelor of Engineering</dt><dd>Teikyo University (Distance Learning)</dd><dd>Apr 2019 - Mar 2025</dd>
    <dt>Bachelor of Social Science</dt><dd>Hitotsubashi University</dd><dd>Apr 2007 - Mar 2011</dd>
  </dl>
  <h2>Blog</h2>
  <ul>
    <li><a href="/blog">the world as code</a> (about tech)</li>
    <li><a href="https://chroju.hatenablog.jp">the world was not enough</a> (about culture)</li>
  </ul>
</article>`,
  })
  write('bio/index.html', out)
}
