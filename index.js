var channels_ids = []
var totalWidth
var channel_id



function render(callback){
	var _this = this
	$.getJSON('//jirenguapi.applinzi.com/fm/getChannels.php').done(function(ret){
		var totalWidth
		for(var i = 0;i < ret.channels.length;i++){

			var tal = ''
			tal += '<li class="cover" channel_id = '+  ret.channels[i].channel_id   + '>' +
					'<img src='  + ret.channels[i].cover_small   + '>' +
					'<h3>' + ret.channels[i].name + '</h3>'
					+ '</li>'


		    $('.box').append($(tal))
		   

		}
		channel_id = ret.channels[4].channel_id
		getMusic(channel_id)
		totalWidth = $('.cover').width() * ret.channels.length
		$('.box').css({
			width :totalWidth + 'px'
		})

		callback && callback()
   
	}).fail(function(){
		console.log(fail)
	})
}

render(loadMusic)

var audio = new Audio()
var channel_id
var sid 

function loadMusic(){

	$('.cover').on('click',function(){
		channel_id = $(this).attr('channel_id')
		channel_name = $(this).find('h3').text()
  	   	getMusic(channel_id)
  	   	$('.tag').text(channel_name)
  	   	
     })
	

}


function fakeNumber(){
	var number = Math.floor(Math.random()*1000)
	return number
}


function setNumber(){
	$('.icon-erji').text(fakeNumber())
	$('.icon-heart').text(fakeNumber())
	$('.icon-dianzan').text(fakeNumber())

}



function getMusic(xxx){
	$.getJSON('//jirenguapi.applinzi.com/fm/getSong.php', {channel:xxx})
        .done(function(ret){
          setNumber()
          audio.src = ret.song[0].url
          sid = ret.song[0].sid
          loadLyric(sid)
          audio.play()
          setStyle(ret)
                })
}
var lyricObj = {}
function loadLyric(sid){
	lyricObj = {}
	$.getJSON('//jirenguapi.applinzi.com/fm/getLyric.php', {sid: sid}).done(function(ret){
		var arr = []
		arr = ret.lyric.split('\n')
		arr [0] = '来自百度FM'
		arr.forEach(function(element){

			var times = element.match(/\d{2}:\d{2}/g)
			var words = element.replace(/\[.+?\]/g,'')
			lyricObj[''+times] = words
		})
	})
}




function setStyle(ret){
	$('.author').text(ret.song[0].artist)
	$('.detail h1').text(ret.song[0].title)
	$('.aside figure').css({
		background : 'url(' + ret.song[0].picture + ')',
		'background-size' : 'cover',
		'background-position' : 'center center'
	}) 
	$('.bg').css({
		background : 'url(' + ret.song[0].picture + ')',
		'background-size' : 'cover',
		'background-position' : 'center center'
	})
}


$('.icon-next').on('click',function(){
	getMusic(channel_id)
})


$(audio).on('playing',function(){
	$('.btn').removeClass('icon-bofanganniu').addClass('icon-zanting')
	setInterval(function(){
		var percent = (audio.currentTime / audio.duration) * 100
		$('.bar-progress').css({
			width:percent +'%' 
		})
		var min = Math.floor(audio.currentTime / 60)
		var sec = audio.currentTime % 60 > 10? Math.floor( audio.currentTime % 60) : '0'+ Math.floor( audio.currentTime % 60)
		$('.current-time').text(min + ':' + sec)
		if(lyricObj['0' + min + ':' + sec]) {
			$('.lyric p').text(lyricObj['0' + min + ':' + sec])
		}

		
	},1000)
	
})
$(audio).on('pause',function(){
	$('.btn').removeClass('icon-zanting').addClass('icon-bofanganniu')
	console.log(1)
})
$(audio).on('ended',function(){
	getMusic(channel_id)

})



$('.btn').on('click',function(){
	if($(this).hasClass('icon-zanting')) audio.pause()
	if($(this).hasClass('icon-bofanganniu')) audio.play()

})

$('.icon-next1').on('click',function(){
	var gap = $('.box').width() - $('.contain').width()
	if(parseInt($('.box').css('left')) < (-(gap))) return
	var countRow = Math.floor(parseInt($('.contain').css('width')) / parseInt($('.cover').css('width')))

	$('.box').animate({
		left:'-=' + $('.cover').outerWidth(true)*countRow +'px'
	},400)
})

$('.icon-back').on('click',function(){
	var countRow = Math.floor(parseInt($('.contain').css('width')) / parseInt($('.cover').css('width')))
	if($('.box').css('left') >= (0+'px') ) return
		$('.cover').outerWidth(true)
	$('.box').animate({
		left:'+=' + $('.cover').outerWidth(true)*countRow +'px'
	},400)
})