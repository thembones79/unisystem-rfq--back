let SessionLoad = 1
let s:so_save = &g:so | let s:siso_save = &g:siso | setg so=0 siso=0 | setl so=-1 siso=-1
let v:this_session=expand("<sfile>:p")
silent only
silent tabonly
cd ~/Projects/work/unisystem-rfq/unisystem-rfq--back
if expand('%') == '' && !&modified && line('$') <= 1 && getline(1) == ''
  let s:wipebuf = bufnr('%')
endif
let s:shortmess_save = &shortmess
set shortmess=aoO
badd +59 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/repos/offer-repo.ts
badd +120 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/repos/config-repo.ts
badd +1 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/rfqs/new.ts
badd +51 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/offers/new.ts
badd +1 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/repos/rfq-repo.ts
badd +29 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/test/routes/rfqs/list.test.ts
badd +23 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/offers/show.ts
badd +1 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/offers/index.ts
badd +6 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/offers/list.ts
badd +24 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/offers/delete.ts
badd +45 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/offers/edit.ts
badd +83 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/rfqs/edit.ts
badd +37 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/new.ts
badd +3 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/middlewares/current-user.ts
badd +5 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/middlewares/block-kams.ts
badd +12 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/list.ts
badd +23 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/show.ts
badd +24 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/delete.ts
badd +4 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/index.ts
badd +25 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/edit.ts
badd +19 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/offer-router.ts
badd +14 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/config-router.ts
badd +32 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/index.ts
badd +9 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/services/checkPermissions.ts
badd +13 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/services/getAllowedData.ts
badd +1 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/rfqs/show.ts
argglobal
%argdel
$argadd .
edit ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/offers/new.ts
argglobal
balt ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/delete.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
silent! normal! zE
let &fdl = &fdl
let s:l = 30 - ((29 * winheight(0) + 36) / 72)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 30
normal! 04|
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
