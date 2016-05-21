(function(){

    window.document.addEventListener('DOMContentLoaded', function() {

    var ls = localStorage,

    exf = {
        html: function(text) {
        var map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
            };

        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        },
        mail: function (email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        },
        addList: function(list,id){
            var cc = list.length, classChild, child, fragment = document.createDocumentFragment();

                while(cc--){
                    switch (profil.load(list[cc]).s) {
                        case 'x': classChild = 'female'; break;
                        case 'y': classChild = 'male'; break;
                        default: classChild = 'nosex'; break;
                    }
                    child = document.createElement("span");
                    child.className = classChild;
                    child.id = list[cc];
                    fragment.appendChild(child);
                }

                gid(id).appendChild(fragment);
        },
        scrollStep: function(id) {
           var data = id.split('_'),
           move = gid('move_'+data[1]), add, rem, invert, scrollCheck, condition;


           if (data[0] === 'left') {

            move.scrollLeft -= 48;
            invert = 'right';
            rem = move.scrollWidth-move.clientWidth;
            scrollCheck = move.scrollLeft;
            condition = scrollCheck===0;
            }
           if (data[0] === 'right') {

            move.scrollLeft += 48;
            invert = 'left';
            add = move.scrollWidth-move.clientWidth;
            rem = 0;
            scrollCheck = move.scrollLeft;
            condition = move.scrollWidth-move.clientWidth-move.scrollLeft<47;
            }
            if (data[0] === 'up') {

                if (document.body.clientWidth>400) {
                    move.scrollTop -= 18;
                } else {
                    move.scrollTop -= 17;
                }

            invert = 'down';
            rem = move.scrollHeight-move.clientHeight;
            scrollCheck = move.scrollTop;
            condition = scrollCheck===0;
            }

           if (data[0] === 'down') {

                if (document.body.clientWidth>400) {
                    move.scrollTop += 18;
                } else {
                     move.scrollTop += 17;
                }

            invert = 'up';
            rem = 0;
            scrollCheck = move.scrollHeight;
            condition = move.scrollHeight-move.clientHeight-move.scrollTop<16
            }

            if (condition) {
                gid(id).classList.add('vhide');
            }
            if (scrollCheck!=rem) {
                if(gid(invert+'_'+data[1]).classList.contains('vhide')){
                        gid(invert+'_'+data[1]).classList.remove('vhide');
                }
             }
        }
    },
    profil = {

        load:function(id){
            try{
                 return JSON.parse(ls.getItem(id));
            } catch(e){
                return false;
            }
        },
        save:function(id,data){
            ls.setItem(id, JSON.stringify(data));
        },
        create:function(data){

             var extInt, time, uid;

             function getRandomInt(min, max) {
                return Math.floor(Math.random() * (max - min)) + min;
             }
             data = data || {};
             extInt = getRandomInt(1000,9999);
             time=new Date().getTime();
             time+=''+extInt;
             uid = Number(time).toString(16);
             ls.setItem(uid, JSON.stringify(data));
             return ""+uid;

        },
        sibling: function(x,y){
            var array = {x:[],y:[],s:[]}, px = profil.load(x), py = profil.load(y), asc;

           function intersection(x, y) {
                return x.filter(function(n) {
                        return y.indexOf(n) != -1;
                });
            }

            if(px!==null) {
                array.x = px.c;
                array.x.splice(array.x.indexOf(iface.profil),1);
            }
            if (py!==null) {
                array.y = py.c;
                array.y.splice(array.y.indexOf(iface.profil),1);
            }

            array.s = intersection(array.x,array.y);
            asc = array.s.length;

                if(asc>0){
                    while (asc--) {
                        if(array.x.indexOf(array.s[asc])!= -1) array.x.splice(array.x.indexOf(array.s[asc]),1);
                        if(array.y.indexOf(array.s[asc])!= -1) array.y.splice(array.y.indexOf(array.s[asc]),1);
                    }
                }

            return array;
        },
        family: function(p,array){

            var person =  profil.load(p);
            if (!array) {
                array = [];
            }

            if (array.indexOf(p)<0) {
                array.push(p);
                if (person.x) { if (array.indexOf(person.x)<0) {profil.family(person.x,array);}}
                if (person.y) { if (array.indexOf(person.y)<0) {profil.family(person.y,array);}}

                if (person.c) {
                    var cc = person.c.length;
                    while(cc--){
                        if (array.indexOf(person.c[cc])<0) {profil.family(person.c[cc],array);}
                    }
                }

                if (person.p) {
                    var pc = person.p.length;
                    while(pc--){
                        if (array.indexOf(person.p[pc])<0) {profil.family(person.p[pc],array);}
                    }
                }

            }
            return array;
        },
        id: function(email){
            var count = ls.length;
            while(count--){
                var key = ls.key(count), p;
                    p = this.load(key);
                    if(p.email===email){
                        return key;
                        break;
                    }
            }
            return false;
        }
    },

    iface = {
        i: null,
        profil: null,
        login: function(login){
            var uid;
            if(!ls.getItem(login)){
                if(profil.id(login)===false){
                    uid = profil.create({email:login});
                    ls.setItem(login, uid);
                } else {
                    uid = profil.id(login);
                    ls.setItem(login, uid);
                }
            } else {
                uid = ls.getItem(login);
            }
            this.i = uid;
            this.gen = 0;
            this.main(uid);
            gid('enter').classList.add('hide');
            gid('tree').classList.remove('hide');
        },
        main: function(id){

            if(id.length===14){
                this.clear();
                this.profil = id;

                var p =profil.load(id),
                     psex = (p.s ==='x') ? 'py' : 'px',
                     place, born, bornText, cc,
                     sibling = profil.sibling(p.x,p.y),
                     motherName = 'Mother',motherNameLength,  fatherName = 'Father', fatherNameLength;

                if(p.name) { gid('title').innerHTML = exf.html(p.name); }
                if(p.activity) {
                   gid('activity').classList.remove('vhide');
                   gid('activity').innerHTML = exf.html(p.activity);
                   }
                if(p.born) { born = 'Date of Birth:  '+p.born; } else { born =''; }
                if(p.place) { place = p.place; } else { place =''; }

                if(p.born){ gid('born').innerHTML = exf.html(born+' '+place); }

                if(p.x){
                    gid("text_sibling").classList.remove('vhide');
                    gid('sib_add_x').classList.remove('vhide');
                    gid('mother').classList.remove('none');
                    motherNameLength = profil.load(p.x).name;
                    if(motherNameLength && motherNameLength.length<9){
                        motherName = motherNameLength}
                }

                gid('mother').innerHTML = motherName;
                if(p.y){
                    gid("text_sibling").classList.remove('vhide');
                    gid('sib_add_y').classList.remove('vhide');
                    gid('father').classList.remove('none');
                    fatherNameLength = profil.load(p.y).name;
                    if(fatherNameLength && fatherNameLength.length<9){
                        fatherName = fatherNameLength
                    }
                }
                gid('father').innerHTML = fatherName;

                gid('geniration').innerHTML = this.gen;


               if (p.c) {
                   cc  = p.c.length;
                   exf.addList(p.c,'children');
                   if (cc>6) {
                    gid('right_child').classList.remove('vhide');
                    gid('move_child').scrollLeft = 0;
                   }
               }
               if (p.s && p.p) { gid('add_child').classList.remove('hide'); }
               if (p.s && p.p || cc) { gid('children_text').classList.remove('hide'); }
               if (p.s) { gid('partner').classList.remove('hide'); }

               if (p.p) {
                gid('partner').className =psex;
                var pData = profil.load(p.p[0]), pName = '&nbsp;';
                if (pData && pData.name) { pName = exf.html(pData.name); }
                gid('partner_name').innerHTML = pName;

                if (p.p.length>1) {
                    var partners = document.createDocumentFragment(),
                    pc = p.p.length, par;

                    while(pc--){
                        var text = document.createTextNode("•");
                        par = document.createElement("i");
                        par.appendChild(text);
                        par.id = 'partner_'+p.p[pc];
                        partners.insertBefore(par, partners.firstChild);
                    }

                    gid('other_partner').appendChild(partners);

                    gid('other_partner').classList.remove('vhide');
                    gid('partner_'+p.p[0]).classList.add('color'+psex);
                }

                gid('partner').setAttribute("data-id", p.p[0]);
                }

               if (p.x && p.y) {
                      gid("text_sibling").classList.remove('vhide');
                      gid("add_sibling").classList.remove('vhide');
               }

               if(sibling.s.length>0 || sibling.x.length>0 || sibling.y.length>0){
                     gid("text_sibling").classList.remove('vhide');
                     if(sibling.s.length){exf.addList(sibling.s,'sibling'); if (sibling.s.length>4) { gid('right_sibling').classList.remove('vhide');gid('move_sibling').scrollLeft = 0;}}
                     if(sibling.x.length){exf.addList(sibling.x,'sibx'); if (sibling.x.length>3) { gid('down_sibx').classList.remove('vhide'); gid('move_sibx').scrollTop = 0;}}
                     if(sibling.y.length){exf.addList(sibling.y,'siby'); if (sibling.y.length>3) { gid('down_siby').classList.remove('vhide'); gid('move_siby').scrollTop = 0;}}


               }
            }
        },
        edit: {
            load: function(){

                 var edit = profil.load(iface.profil);

                 gid('edit_name').value = edit.name || '';
                 gid('edit_surname').value = edit.surname || '';
                 gid('edit_bornname').value = edit.bornname || '';
                 gid('edit_born').value = edit.born || '';
                 gid('edit_place').value = edit.place || '';
                 gid('edit_activity').value = edit.activity || '';
                 gid('edit_e-mail').value = edit.email || '';

                 switch (edit.s) {
                        case "x":
                            gid('radiox').checked =true;
                            gid('radioy').disabled = true;
                            gid('div_bornname').classList.remove('hide');
                        break;
                        case "y":
                            gid('radioy').checked =true;
                            gid('radiox').disabled = true;
                        break;
                 }

                 gid('tree-body').classList.add('hide');
                 gid('tree-edit').classList.remove('hide');
                 gid('title').innerHTML = '';
                 gid('action').setAttribute("data-id", "save");
                 gid('action').value = 'Save';
            },
            save: function(){

                 var edit = profil.load(iface.profil),
                      editSex, eMail = gid('edit_e-mail').value;

                 if(gid('radiox').checked === true) { editSex =  gid('radiox').value; }
                 if(gid('radioy').checked === true) { editSex =  gid('radioy').value; }
                 edit.s = editSex ? editSex : undefined;

                 edit.name = gid('edit_name').value || undefined;
                 edit.bornname = gid('edit_bornname').value || undefined;
                 edit.surname = gid('edit_surname').value || undefined;
                 edit.born = gid('edit_born').value || undefined;
                 edit.place = gid('edit_place').value || undefined;
                 edit.activity = gid('edit_activity').value || undefined;

                 // eMail  validate
                 if (iface.i === iface.profil) {
                    if (edit.email!==eMail && exf.mail(eMail)) {
                           if (ls.getItem(edit.email)) {
                            ls.removeItem(edit.email);
                            }
                            edit.email = eMail;
                    }
                 } else {
                    if(eMail!=='' && exf.mail(eMail)){ edit.email = eMail;} else { edit.email = (eMail!=='') ? edit.email : undefined;}
                 }

                 profil.save(iface.profil, edit);
                 iface.main(iface.profil);

                 gid('tree-edit').classList.add('hide');
                 gid('tree-body').classList.remove('hide');

                 gid('action').value = 'Edit';
                 gid('action').setAttribute("data-id", "edit");
                 gid('extras').classList.remove('up');
                 gid('extras_place').classList.add('hide');
            }
        },
        element: function(gid){
                return window.document.getElementById(gid);
        },
        clear:function(){
            var setHTML = ['title', 'activity', 'mother', 'father', 'children', 'sibling', 'sibx', 'siby', 'other_partner', 'partner_name'],
                  setValue =['edit_name', 'edit_surname', 'edit_born', 'edit_place', 'edit_activity', 'edit_e-mail', 'edit_bornname'],
                  setClassVhide = ['activity', 'text_sibling', 'add_sibling', 'sib_add_x', 'sib_add_y', 'left_child', 'right_child', 'left_sibling', 'right_sibling','up_sibx','up_siby','down_sibx','down_siby', 'other_partner'];

            setHTML.forEach(function(i) { gid(i).innerHTML=''; });
            setValue.forEach(function(i) { gid(i).value=''; });
            setClassVhide.forEach(function(i) { gid(i).classList.add('vhide'); });

            gid('born').innerHTML='&nbsp;';

            gid('radiox').checked = false;
            gid('radioy').checked = false;
            gid('radiox').disabled = false;
            gid('radioy').disabled = false;

            gid('mother').classList.add("none");
            gid('father').classList.add("none");

            gid('partner').className = 'padd';
            gid('partner').removeAttribute('data-id');

            gid('children_text').classList.add('hide');
            gid('add_child').classList.add('hide');
            gid('partner').classList.add('hide');
            gid('div_bornname').classList.add('hide');

        }

    },
    // get iface element
    gid = iface.element;

    /*
     *  Handlers for Interface
     */

        // save login checkbox
        if(ls.login){
            gid('login').value=ls.login;
            gid('loginSave').checked =true;
        }

        gid('login').onkeydown=function(e){
            if(e.keyCode == 13){gid('doEnter').click();}
        };
        gid('login').onfocus = function(){
            this.value='';
        };

        // action by login click
        gid('doEnter').onclick = function(){

             var login = gid('login').value;


             if (exf.mail(login)) {
                    if(gid('loginSave').checked===true){
                       ls.setItem('login', login);
                    } else {
                        if(login===ls.login){
                           ls.removeItem('login');
                        }
                    }
                iface.login(login);
            }
        };

        // Edit & Save Button
        gid('action').onclick = function(){
                var act = this.getAttribute('data-id');
                if(act==='edit'){
                     iface.edit.load();
                }
                if(act==='save'){
                     iface.edit.save();
                }
        };

        // Extra setting Button & Place
        gid('extras').onclick = function(){
                gid('extras').classList.toggle("up");
                gid('extras_place').classList.toggle('hide');
        };

        // Add mothe or select
        gid('parents').onclick = function(e){

            var per, par;
            switch (e.target.id) {
                case 'mother':
                    per = 'x';
                    par ='y';
                break;
                case 'father':
                    per = 'y';
                    par ='x';
                break;
                default:
                    return false;
                break;
            }

            var person = profil.load(iface.profil);
                if (person[per]) {
                    iface.gen++;
                    iface.main(person[per]);
                } else {
                    var val  = {s:per,c:[iface.profil]};
                    if (person[par]) {
                        var partner = profil.load(person[par]);
                        val.p = [person[par]];
                    }
                    gid("text_sibling").classList.remove('vhide');
                    gid("sib_add_"+per).classList.remove('vhide');
                    gid(e.target.id).classList.remove('none');
                    person[per] = profil.create(val);
                    profil.save(iface.profil, person);

                     if(partner) {
                        if (!partner.p) {
                            partner.p = [person[per]];
                        } else {
                            partner.p.push(person[per]);
                        }

                        profil.save(person[par], partner);
                        gid("text_sibling").classList.remove('vhide');
                        gid("add_sibling").classList.remove('vhide');
                    }
                }
        };

        gid('children').onclick = function(e){
            iface.gen--;
            iface.main(e.target.id);
        };

        gid('sibling').onclick = function(e){ iface.main(e.target.id); };
        gid('sibx').onclick = function(e){ iface.main(e.target.id); };
        gid('siby').onclick = function(e){ iface.main(e.target.id); };

        gid('radiox').onclick = function(){ gid('div_bornname').classList.remove('hide'); };
        gid('radioy').onclick = function(){ gid('div_bornname').classList.add('hide'); gid('edit_bornname').value = '';};

        gid('add_child').onclick = function(){
            var parent = profil.load(iface.profil),
                 partner = profil.load(parent.p[0]),
                 val = '{"'+parent.s+'":"'+iface.profil+'","'+partner.s+'":"'+parent.p[0]+'"}',
                 child = document.createElement("span");

                 child.className = 'nosex';
                 child.id = profil.create(JSON.parse(val));

                 if(!parent.c){ parent.c = []; }
                 if(!partner.c){ partner.c = []; }
                 parent.c.push(child.id);
                 partner.c.push(child.id);
                 profil.save(iface.profil,parent);
                 profil.save(parent.p[0],partner);

                 if (parent.c.length>6) {
                    gid('right_child').classList.remove('vhide');
                 }
                 gid("children").appendChild(child);
        };

        gid('add_sibling').onclick = function(){
            var i = profil.load(iface.profil),
                  parentX = profil.load(i.x),
                  parentY = profil.load(i.y),
                  val = '{"x":"'+i.x+'","y":"'+i.y+'"}',
                  sib = document.createElement("span");

                 sib.className = 'nosex';
                 sib.id = profil.create(JSON.parse(val));

                 if(!parentX.c){ parentX.c = []; }
                 if(!parentY.c){ parentY.c = []; }
                 parentX.c.push(sib.id);
                 parentY.c.push(sib.id);
                 profil.save(i.x,parentX);
                 profil.save(i.y,parentY);

                 if (profil.sibling(i.x,i.y).s.length > 4) {
                    gid('right_sibling').classList.remove('vhide');
                 }
                 gid("sibling").appendChild(sib);
        };
        gid('sib_add_x').onclick = function(){
                var i = profil.load(iface.profil),
                  parentX = profil.load(i.x),
                  val = '{"x":"'+i.x+'"}',
                  sib = document.createElement("span");
                  sib.className = 'nosex';
                  sib.id = profil.create(JSON.parse(val)),
                  sibling = profil.sibling(i.x,i.y);

                 if(!parentX.c){ parentX.c = []; }
                 parentX.c.push(sib.id);
                 profil.save(i.x,parentX);
                 gid("sibx").appendChild(sib);


                  if (sibling.x.length>2) {
                    gid('down_sibx').classList.remove('vhide');
                }

        };
        gid('sib_add_y').onclick = function(){
                var i = profil.load(iface.profil),
                  parentY = profil.load(i.y),
                  val = '{"y":"'+i.y+'"}',
                  sib = document.createElement("span");
                  sib.className = 'nosex';
                  sib.id = profil.create(JSON.parse(val)),
                  sibling = profil.sibling(i.x,i.y);

                 if(!parentY.c){ parentY.c = []; }
                 parentY.c.push(sib.id);
                 profil.save(i.y,parentY);
                 gid("siby").appendChild(sib);

                if (sibling.y.length>2) {
                    gid('down_siby').classList.remove('vhide');
                }
        };

        gid('partner').onclick = function(){
                var person = profil.load(iface.profil), partner, val, sex;

                if(this.hasAttribute("data-id")){
                    iface.main(this.getAttribute("data-id"));
                } else {
                    if (person.s === 'x') { sex = 'y';}
                    if (person.s === 'y') { sex = 'x';}
                    val =  '{"s":"'+sex+'","p":["'+iface.profil+'"]}';
                    partner = profil.create(JSON.parse(val));
                    person.p = [partner];
                    profil.save(iface.profil,person);
                    this.className='p'+sex;
                    this.setAttribute("data-id", partner);
                    gid('add_child').classList.remove('hide');
                    gid('children_text').classList.remove('hide');
                }

        };

        gid('other_partner').onclick = function(){
            var i = profil.load(iface.profil),
                 m = i.p.shift();
                 i.p.push(m);
                 profil.save(iface.profil, i), psex = i.s==='x' ? 'py' : 'px',
                 pData = profil.load(i.p[0]), pName = '&nbsp;';

                 gid('partner_'+m).classList.remove('color'+psex);
                 gid('partner').setAttribute("data-id",  i.p[0]);
                 gid('partner_'+i.p[0]).classList.add('color'+psex);


                if (pData && pData.name) { pName = exf.html(pData.name); }
                gid('partner_name').innerHTML = pName;
                 //iface.main(iface.profil);
        };
        /*Scroll Child Left*/
        gid('left_child').onclick = function(){  exf.scrollStep(this.id); };
        /*Scroll Child Right*/
        gid('right_child').onclick = function(){ exf.scrollStep(this.id); };
         /*Scroll Sibling Left*/
        gid('left_sibling').onclick = function(){  exf.scrollStep(this.id); };
        /*Scroll Sibling Right*/
        gid('right_sibling').onclick = function(){ exf.scrollStep(this.id); };

         /*Scroll Sibling Y Up*/
        gid('up_siby').onclick = function(){  exf.scrollStep(this.id); };
        /*Scroll Sibling Y Down*/
        gid('down_siby').onclick = function(){ exf.scrollStep(this.id); };
         /*Scroll Sibling Y Up*/
        gid('up_sibx').onclick = function(){  exf.scrollStep(this.id); };
        /*Scroll Sibling Y Down*/
        gid('down_sibx').onclick = function(){ exf.scrollStep(this.id); };

        gid('tree').onclick = function(){
            // console.time('family');
            //console.log(profil.family(iface.profil));
            //console.timeEnd('family');
        };


    });



})();
