/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function Reindirizzamento() {
    var link= "game_score.htm?name=" + document.myGameForm.NomeUtente.value;
    windows.open(link);
    }

