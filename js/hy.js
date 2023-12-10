var rule = {
    title:'虎牙',
    host:'https://www.huya.com',
    homeUrl:'/cache.php?m=LiveList&do=getLiveListByPage&gameId=2168&tagAll=0&page=1',//用于"分类获取"和"推荐获取"
    url:'/cache.php?m=LiveList&do=getLiveListByPage&gameId=fyfilter&tagAll=0&page=fypage',
    class_name:'娱乐',
    class_url:'8&1&2&3',
    detailUrl:'https://m.huya.com/fyid',//二级详情拼接链接(json格式用)
    filterable: 1,
    filter_url: '{{fl.cateId}}',
    filter_def:{
        8:{cateId:'2135'},
        1:{cateId:'1'},
        2:{cateId:'1732'},
        3:{cateId:'2336'}
    },
    filter:{
         8:[{"key":"cateId","name":"分类","value":[{"n":"一起看","v":"2135"},,{"n":"放映厅","v":"6245"}]}]
           },
    searchUrl:'https://search.cdn.huya.com/?m=Search&do=getSearchContent&q=**&uid=0&v=4&typ=-5&livestate=0&rows=40&start=0',
    searchable:2,
    quickSearch:0,
    headers:{
        'User-Agent':'MOBILE_UA'
    },
    timeout:5000,
    limit:8,
    play_parse:true,
    lazy:`js:
        let rid = input.match(/\\/ (\\d + ) / )[1];
        function getRealUrl(live_url) {
            let [i, b] = live_url.split('?');
            let r = i.split('/').pop();
            let s = r.replace(/\.(flv|m3u8)/, '');
            let c_tmp = b.split('&').filter(n => n);
            let n = {};
            let c_tmp2 = [];
            c_tmp.forEach(function(tmp, index) {
                if (index < 3) {
                    n[tmp.split('=')[0]] = tmp.split('=')[1]
                } else {
                    c_tmp2.push(tmp)
                }
            });
            let tmp2 = c_tmp2.join('&');
            n[tmp2.split('=')[0]] = tmp2.split('=')[1];
            let fm = decodeURIComponent(n.fm).split('&')[0];
            let u = base64Decode(fm);
            let p = u.split('_')[0];
            let f = new Date().getTime() + '0000';
            let ll = n.wsTime;
            let t = '0';
            let h = [p, t, s, f, ll].join('_');
            let m = md5(h);
            return (i + '?wsSecret=' + m + '&wsTime=' + ll + '&u=' + t + '&seqid=' + f + '&' + c_tmp2.pop()).replace('hls', 'flv').replace('m3u8', 'flv')
        }
        let purl = JSON.parse(request('https://mp.huya.com/cache.php?m=Live&do=profileRoom&roomid=' + rid)).data.stream.flv.multiLine[0].url;
        input = {
            jx: 0,
            url: getRealUrl(purl),
            parse: 0,
            header: JSON.stringify({
                'user-agent': 'Mozilla/5.0'
            })
        }
    `,
    推荐:`js:
        let d = [];
        let jo = JSON.parse(request(input)).data.datas;
        jo.forEach(it => {
                d.push({
                    url: it.profileRoom,
                    title: it.introduction,
                    img: it.screenshot,
                    desc: '👁' + it.totalCount + '  🆙' + it.nick,
                })
        });
        setResult(d);
    `,
    一级:`js:
        let d = [];
        let jo = JSON.parse(request(input)).data.datas;
        jo.forEach(it => {
                d.push({
                    url: it.profileRoom,
                    title: it.introduction,
                    img: it.screenshot,
                    desc: '👁' + it.totalCount + '  🆙' + it.nick,
                })
        });
        setResult(d);
    `,
    二级:'*',
    搜索:'json:response.3.docs;game_roomName;game_screenshot;game_nick;room_id',
}
