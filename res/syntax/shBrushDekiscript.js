dp.sh.Brushes.Dekiscript=function()
{
    var datatypes='nil bool num str map list true false';
    var keywords='if else foreach var let switch case default break continue typeof in null';

    this.regexList=[{regex:dp.sh.RegexLib.SingleLineCComments,css:'comment'},
                    {regex:dp.sh.RegexLib.MultiLineCComments,css:'comment'},
                    {regex:dp.sh.RegexLib.DoubleQuotedString,css:'string'},
                    {regex:dp.sh.RegexLib.SingleQuotedString,css:'string'},
                    {regex:new RegExp(this.GetKeywords(datatypes),'gm'),css:'datatypes'},
                    {regex:new RegExp(this.GetKeywords(keywords),'gm'),css:'keyword'}];
    
    this.CssClass='dp-dekiscript';this.Style='.dp-dekiscript .datatypes { color: #2E8B57; font-weight: bold; }';
}

dp.sh.Brushes.Dekiscript.prototype=new dp.sh.Highlighter();dp.sh.Brushes.Dekiscript.Aliases=['dekiscript','script'];

