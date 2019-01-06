var oktet1;
var oktet2;
var oktet3;
var oktet4;

var sOktet1;
var sOktet2;
var sOktet3;
var sOktet4;

var kelas;
var subnet;
var ipBiner;
var blokTablesElement;

var smBiner = "";
    var smBiner1;
    var smBiner2;
    var smBiner3;
    var smBiner4;

var smDesimal;
    var smDesimal1;
    var smDesimal2;
    var smDesimal3;
    var smDesimal4;

var nilaix;
var nilaiy;
var jumlahBlok;
var jHostPerBlok;
var jHostValidPerBlok;

function submit(){
    oktet1 = Number(document.getElementById('oktet1').value);
    oktet2 = Number(document.getElementById('oktet2').value);
    oktet3 = Number(document.getElementById('oktet3').value);
    oktet4 = Number(document.getElementById('oktet4').value);
    
    sOktet1 = oktet1.toString(2);
    sOktet2 = oktet2.toString(2);
    sOktet3 = oktet3.toString(2);
    sOktet4 = oktet4.toString(2);

    if(oktet1 >= 0 && oktet1 <= 127){
        kelas = 'A';
        sOktet2 = "0";//oktet2.toString(2);
        sOktet3 = "0";//oktet3.toString(2);
        sOktet4 = "0";//oktet4.toString(2);
    } else if(oktet1 >= 128 && oktet1 <= 191){
        kelas = 'B';
        sOktet3 = "0";//oktet3.toString(2);
        sOktet4 = "0";//oktet4.toString(2);
    } else if(oktet1 >= 192 && oktet1 <= 223){
        kelas = 'C';
        sOktet4 = "0";//oktet4.toString(2);
    } else if(oktet1 >= 224 && oktet1 <= 239){
        kelas = 'D';
        M.toast({html: 'Aplikasi belum mendukung IP kelas D!'});
        document.getElementById('ipaddresshelper').innerHTML = "IP Kelas : " + kelas;
        return;
    } else {
        kelas = 'E';
        M.toast({html: 'Aplikasi belum mendukung IP kelas E!'});
        document.getElementById('ipaddresshelper').innerHTML = "IP Kelas : " + kelas;
        return;
    }

    while(sOktet1.length < 8){
        sOktet1 = "0" + sOktet1;
    }
    while(sOktet2.length < 8){
        sOktet2 = "0" + sOktet2;
    }
    while(sOktet3.length < 8){
        sOktet3 = "0" + sOktet3;
    }
    while(sOktet4.length < 8){
        sOktet4 = "0" + sOktet4;
    }
    document.getElementById('print').disabled = false;
    document.getElementById('subnet').disabled = false;
    document.getElementById('ipaddress').value = String(document.getElementById('oktet1').value + "." + document.getElementById('oktet2').value + "." + document.getElementById('oktet3').value + "." + document.getElementById('oktet4').value);
    document.getElementById('ipaddresshelper').innerHTML = "IP Kelas : " + kelas;
}

function print(){
    blokTablesElement = document.getElementById('blok-tables');
    blokTablesElement.innerHTML = "";


    subnet = Number(document.getElementById('subnet').value);
    ipBiner = sOktet1 + sOktet2 + sOktet3 + sOktet4;

    
    smBiner = "";
    for(i=0; i<32; i++){
        if(subnet > 0){
            smBiner += "1";
            subnet -= 1;
        } else {
            smBiner += "0";
        }
    }
    
    smBiner1 = smBiner.substring(0, 8);
    smBiner2 = smBiner.substring(8, 16);
    smBiner3 = smBiner.substring(16, 24);
    smBiner4 = smBiner.substring(24, 32);
    
    if(kelas == 'C'){
        nilaix = (smBiner4.match(/1/g) || []).length;
        nilaiy = (smBiner4.match(/0/g) || []).length;
    } else if(kelas == 'B'){
        nilaix = ((smBiner3+smBiner4).match(/1/g) || []).length;
        nilaiy = ((smBiner3+smBiner4).match(/0/g) || []).length;
    } else {
        nilaix = ((smBiner2+smBiner3+smBiner4).match(/1/g) || []).length;
        nilaiy = ((smBiner2+smBiner3+smBiner4).match(/0/g) || []).length;
    }

    smDesimal1 = parseInt(smBiner1, 2);
    smDesimal2 = parseInt(smBiner2, 2);
    smDesimal3 = parseInt(smBiner3, 2);
    smDesimal4 = parseInt(smBiner4, 2);

    jumlahBlok = Math.pow(2, nilaix);
    jHostPerBlok = Math.pow(2, nilaiy);
    jHostValidPerBlok = jHostPerBlok - 2;
    var ipvalid = {
        awal: [jumlahBlok], 
        akhir: [jumlahBlok]
    };
    var ipnetwork = [jumlahBlok];
    var ipbroadcast = [jumlahBlok];
    for(var i=0; i<jumlahBlok; i++){
        if(i==0){
            ipnetwork[i] = parseInt(ipBiner, 2);
            ipvalid.awal[i] = ipnetwork[i] + 1;
            ipvalid.akhir[i] = ipnetwork[i] + jHostValidPerBlok;
            ipbroadcast[i] = ipvalid.akhir[i] + 1;
        } else {
            ipnetwork[i] = ipbroadcast[i - 1] + 1;
            ipvalid.awal[i] = ipnetwork[i] + 1;
            ipvalid.akhir[i] = ipnetwork[i] + jHostValidPerBlok;
            ipbroadcast[i] = ipvalid.akhir[i] + 1;
        }
    }
    document.getElementById('alamatip').innerHTML = document.getElementById('ipaddress').value + "/" + document.getElementById('subnet').value;
    document.getElementById('subnetmaskbiner').innerHTML = smBiner1+"."+smBiner2+"."+smBiner3+"."+smBiner4;
    document.getElementById('subnetmaskdesimal').innerHTML = smDesimal1+"."+smDesimal2+"."+smDesimal3+"."+smDesimal4;
    document.getElementById('jblok').innerHTML = jumlahBlok;
    document.getElementById('jhostperblok').innerHTML = jHostPerBlok;
    document.getElementById('jhostvalidperblok').innerHTML = jHostValidPerBlok;
    
    
    // console.log(subnet);
    // console.log(ipBiner);
    // console.log(smBiner1+"."+smBiner2+"."+smBiner3+"."+smBiner4);
    // console.log(smDesimal1+"."+smDesimal2+"."+smDesimal3+"."+smDesimal4);
    // console.log(jumlahBlok);
    // console.log(jHostPerBlok);
    // console.log(jHostValidPerBlok);

    for (var i=0; i<jumlahBlok; i++){
        
        var networkValue = ipnetwork[i].toString(2);
        var validAwalValue = ipvalid.awal[i].toString(2);
        var validAkhirValue = ipvalid.akhir[i].toString(2);
        var broadcastValue = ipbroadcast[i].toString(2);
        
        while(networkValue.length < 32){
            networkValue = "0" + networkValue;
            validAwalValue = "0" + validAwalValue;
            validAkhirValue = "0" + validAkhirValue;
            broadcastValue = "0" + broadcastValue;
        }
        ipnetwork[i] = [];
        ipvalid.awal[i] = [];
        ipvalid.akhir[i] = [];
        ipbroadcast[i] = [];
        for(var j=0; j<4; j++){
            ipnetwork[i].push(parseInt(networkValue.substring(8*j, 8*(j+1)), 2));
        }
        for(var j=0; j<4; j++){
            ipvalid.awal[i].push(parseInt(validAwalValue.substring(8*j, 8*(j+1)), 2));
        }
        for(var j=0; j<4; j++){
            ipvalid.akhir[i].push(parseInt(validAkhirValue.substring(8*j, 8*(j+1)), 2));
        }
        for(var j=0; j<4; j++){
            ipbroadcast[i].push(parseInt(broadcastValue.substring(8*j, 8*(j+1)), 2));
        }



        networkValue = String(ipnetwork[i][0])+"."+String(ipnetwork[i][1])+"."+String(ipnetwork[i][2])+"."+String(ipnetwork[i][3]);
        validAwalValue = String(ipvalid.awal[i][0])+"."+String(ipvalid.awal[i][1])+"."+String(ipvalid.awal[i][2])+"."+String(ipvalid.awal[i][3]);
        validAkhirValue = String(ipvalid.akhir[i][0])+"."+String(ipvalid.akhir[i][1])+"."+String(ipvalid.akhir[i][2])+"."+String(ipvalid.akhir[i][3]);
        broadcastValue = String(ipbroadcast[i][0])+"."+String(ipbroadcast[i][1])+"."+String(ipbroadcast[i][2])+"."+String(ipbroadcast[i][3]);
        
        // console.log("Blok : " + String(i+1));
        // console.log("IP Network : " + networkValue);
        // console.log("IP Valid : " + validAwalValue + " - " + validAkhirValue);
        // console.log("IP Broadcast : " + broadcastValue);
        
        blokTablesElement.innerHTML += `
        <table class="col s3 striped" style="border: solid">
            <tbody>
                <tr>
                    <th>Blok</th>
                    <td>`+ String(i+1) +`</td>
                </tr>
                <tr>
                    <th>IP Network</th>
                    <td>`+ networkValue +`</td>
                </tr>
                <tr>
                    <th>IP Valid</th>
                    <td>`+ validAwalValue + " - " + validAkhirValue +`</td>
                </tr>
                <tr>
                    <th>IP Broadcast</th>
                    <td>`+ broadcastValue +`</td>
                </tr>
            </tbody>
        </table>
        `;        
    }
    document.getElementById('control').classList.add("hide");
}