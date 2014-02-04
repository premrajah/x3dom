// load all x3dom JS files
(function() {

var pathes = [
    "../../",
    "../../../x3dom/",
    "../../../../x3dom/"
];

var packages = "tools/packages.json";
var fallback_path = "http://www.x3dom.org/x3dom/";
var found_path = "";
var not_found_count = 0;

for (var i=0; i<pathes.length; i++){
    send_xhr(pathes[i]);
}

function send_xhr(path){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path + packages, false);

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200 || xhr.status == 0){
                //if already found elsewhere, stop
                if(found_path != ""){
                    return;
                }
                found_path = path;
                console.log("found script base path on: " + path);
                setCSS(path);

                var group, p;
                var data = JSON.parse(xhr.responseText);
                if (!data) {
                    console.error("cannot read " + packages);
                    return;
                }

                for(group in data.grouplist){
                    for(p in data.grouplist[group].data){
                        document.write("<script src=\"" + path + "src/" + data.grouplist[group].data[p].path + "\"></script>");
                    }
                }
            }else{
                console.error('xhr status is not 200 on: ' + path);
                not_found_count++;
                if(not_found_count >= pathes.length){
                    console.warn('FALLBACK to x3dom.org');
                    //only once
                    not_found_count = 0;
                    send_xhr(fallback_path);
                }
            }
        }
    };
    xhr.send();
}

function setCSS(path){
    var headNode = document.getElementsByTagName("head")[0];

    var importcss = document.createElement("link");
    importcss.type = "text/css";
    importcss.href = path + "src/x3dom.css";
    console.log("including CSS from: " + importcss.href);
    importcss.rel="stylesheet";
    headNode.appendChild(importcss);
}

})();
