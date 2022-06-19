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
badd +16 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/repos/config-repo.ts
badd +11 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/list.ts
badd +34 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/new.ts
badd +1 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/edit.ts
badd +1 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/offers/new.ts
badd +13 ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/offers/edit.ts
argglobal
%argdel
$argadd .
edit ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/repos/config-repo.ts
let s:save_splitbelow = &splitbelow
let s:save_splitright = &splitright
set splitbelow splitright
wincmd _ | wincmd |
vsplit
1wincmd h
wincmd w
let &splitbelow = s:save_splitbelow
let &splitright = s:save_splitright
wincmd t
let s:save_winminheight = &winminheight
let s:save_winminwidth = &winminwidth
set winminheight=0
set winheight=1
set winminwidth=0
set winwidth=1
exe 'vert 1resize ' . ((&columns * 25 + 72) / 144)
exe 'vert 2resize ' . ((&columns * 118 + 72) / 144)
argglobal
enew
file neo-tree\ filesystem\ \[1]
balt ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/repos/config-repo.ts
setlocal fdm=manual
setlocal fde=0
setlocal fmr={{{,}}}
setlocal fdi=#
setlocal fdl=0
setlocal fml=1
setlocal fdn=20
setlocal fen
wincmd w
argglobal
balt ~/Projects/work/unisystem-rfq/unisystem-rfq--back/src/routes/configs/new.ts
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
let s:l = 20 - ((19 * winheight(0) + 37) / 75)
if s:l < 1 | let s:l = 1 | endif
keepjumps exe s:l
normal! zt
keepjumps 20
normal! 026|
wincmd w
2wincmd w
exe 'vert 1resize ' . ((&columns * 25 + 72) / 144)
exe 'vert 2resize ' . ((&columns * 118 + 72) / 144)
tabnext 1
if exists('s:wipebuf') && len(win_findbuf(s:wipebuf)) == 0 && getbufvar(s:wipebuf, '&buftype') isnot# 'terminal'
  silent exe 'bwipe ' . s:wipebuf
endif
unlet! s:wipebuf
set winheight=1 winwidth=20
let &shortmess = s:shortmess_save
let &winminheight = s:save_winminheight
let &winminwidth = s:save_winminwidth
let s:sx = expand("<sfile>:p:r")."x.vim"
if filereadable(s:sx)
  exe "source " . fnameescape(s:sx)
endif
let &g:so = s:so_save | let &g:siso = s:siso_save
set hlsearch
doautoall SessionLoadPost
unlet SessionLoad
" vim: set ft=vim :
