let i = 0;
const contain_message = document.getElementById('contain_chat');

// const UrlWS = 'https://10.255.3.241/Ws_Btn';
// const url_chatbot = 'https://10.255.3.241/wschatbot';
// const UrlAttachment = 'https://10.255.3.241/wschatlive/FileUpload';
// $.connection.hub.url = "https://10.255.3.241/wschatlive/signalr";

const UrlWS = 'http://192.168.25.61/wschatlive';
const url_chatbot = 'http://192.168.25.61/ChatBot';
const UrlAttachment = 'http://192.168.25.61/signalr/FileUpload';
$.connection.hub.url = "http://192.168.25.61/signalr/signalr";
let chat = $.connection.serverHub;
// console.log(chat);

$(function () {
	$('#form_login').parsley().on('field:validated', function(form) {
		if (this.validationResult === true) {
		  this.$element.removeClass('is-invalid').addClass('is-valid');
		} else {
		  this.$element.addClass('is-invalid').removeClass('is-valid');
		}
	});
	  
	//login
	chat.client.ReturnLoginCust = async function (ValueChatID, FlagChat, message) {
		// console.log(ValueChatID, FlagChat);

		$("#chatID").val(ValueChatID);
		$("#FlagChat").val(FlagChat);
		
		//True = chat old //False = chat new
		if (FlagChat == "True"){
			try {
				const config = {
					method: 'POST',
					headers: {
						"Content-Type" : "application/json"
					},
					body: JSON.stringify({
						Data1:"CustConversation",
						Data2:ValueChatID,
						Data3:"",
						Data4:"",
						Data5:""
					})
				}
		
				const res = await fetch(UrlWS + '/SP_SosialMedia', config);
				const obj = await res.json();
				const raw = obj.data;
				// console.log(raw);
		
				let html = "";
				if (res.ok) {
					for (i = 0; i < raw.length; i++) {
						let content = "";
						const type = raw[i].JenisChat;
						
						if(type == "image"){
							file = "<img src='"+UrlAttachment+"/"+raw[i].Filename+"' height='100px' width='260px' /><br/>" + raw[i].Pesan;
						}else{
							file = "<i class='fas fa-file-text-o'></i> "+ raw[i].Pesan +" (click to download)";
						}

						if(Boolean(raw[i].JenisChat) == true){
							content = `<a href='${UrlAttachment}/${raw[i].Filename}' class='text-warning' target='_blank'> ${file} </a>`;
							// content = `<a href='javascript:();' onclick='window.open("${UrlAttachment}/${raw[i].Filename}", "_blank");' class='text-warning'> ${file} </a>`;
						}else{
							content = raw[i].Pesan;
						}
						
						if(raw[i].FlagTo == "Cust"){
							html += "<div class='direct-chat-msg right'>"+
								"<img class='direct-chat-img' src='dist/img/user.png' alt='message user image'>"+
								"<div class='direct-chat-text'>"+
									"<div class='direct-chat-infos'>"+
									"<span class='direct-chat-name float-right'>" + raw[i].Nama + "</span>"+
									"<span class='direct-chat-timestamp float-left'>" + raw[i].DateCreate + "</span>"+
									"</div><br/>"+
									content +
								"</div>"+
							"</div>";
							
						}else{
							html += "<div class='direct-chat-msg'>"+
								"<img class='direct-chat-img' src='dist/img/agent.png' alt='message user image'>"+
								"<div class='direct-chat-text'>"+
									"<div class='direct-chat-infos'>"+
										"<span class='direct-chat-name float-left'>" + raw[i].Nama + "</span>"+
										"<span class='direct-chat-timestamp float-right'>" + raw[i].DateCreate + "</span>"+
									"</div><br/>"+
									content +
								"</div>"+
							"</div>";
						}
					} 
				
					setTimeout(function () {
						$("#message").removeAttr('disabled');
						$("#btn_send").removeAttr('disabled');
						$("#file_attach").removeAttr('disabled');
						$("#btn_attachment").removeAttr('disabled');
		
						contain_message.innerHTML += html;
						$("#contain_chat").animate({
							scrollTop: contain_message.scrollHeight
						}, "fast");
					}, 1000);
				}
		
			} 
			catch (error) {
				console.log(error);
			}
		}
		else{
			//greeting chat
			getGreeting();
		}
	};
	
	
	//end chat
	//chat terputus dari agent / telah berakhir
	chat.client.ReturnEndChat_User = function (CustID, AgentId, chatID) {
		// console.log(chatID);
		deleteAllCookies();
		let loading = "<div class='direct-chat-msg' id='loading'>"+
			"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
			"<div class='direct-chat-text'>"+
				"<img src='dist/img/loading.gif' width='30px'>" +
			"</div>"+
		"</div>";
		
		$(loading).appendTo($('#contain_chat'));
		$("#contain_chat").animate({
			scrollTop: contain_message.scrollHeight
		}, "fast");

		setTimeout(function () {
			let message = "<div class='direct-chat-msg'>"+
				"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
				"<div class='direct-chat-text'>"+
					"<div class='direct-chat-infos'>"+
						"<span class='direct-chat-name float-left'>Chat Finished</span>"+
					"</div><br/>"+
					// $.trim(chatID) +
					"<p>Terima kasih telah menggunakan layanan chat BTN</p>" +
				"</div>"+
			"</div>";

			$('#loading').remove();
			$('#contain_chat').append(message);
			$("#contain_chat").animate({
				scrollTop: contain_message.scrollHeight
			}, "fast");
			i++;
		}, 1000 + (Math.random() * 20) * 100);
		
		setTimeout(function () {
			$('#FormFeedback').removeClass('hide').show();
			// location.reload();
		},5000);
	};
	
	//pesan balikan dari agent
	chat.client.ReturnSendMessageDataAgent = function (clientId, client_name, text, AgentId, Agent_name, typeFile, AttachImage, DateCreate) {
		// console.log(clientId, client_name, text, AgentId, Agent_name, typeFile, AttachImage, DateCreate);
		
		let encodedAgentID = $('<div />').text(AgentId).html();
		let encodedAgentName = $('<div />').text(Agent_name).html();
		// let encodedAgentText = $('<div />').text(text).html();
		let encodedAgentText = (text).replace(/\r?\n/g, '<br>');
		

		$("#AgentID").val(encodedAgentID);
		$("#AgentName").val(encodedAgentName);
		$("#message").removeAttr('disabled');
		$("#btn_send").removeAttr('disabled');
		$("#file_attach").removeAttr('disabled');
		$("#btn_attachment").removeAttr('disabled');
		
		let loading = "<div class='direct-chat-msg' id='loading'>"+
			"<img class='direct-chat-img' src='dist/img/agent.png' alt='message user image'>"+
			"<div class='direct-chat-text'>"+
				"<img src='dist/img/loading.gif' width='30px'>" +
			"</div>"+
		"</div>";

		$(loading).appendTo($('#contain_chat'));
		$("#contain_chat").animate({
			scrollTop: contain_message.scrollHeight
		}, "fast");

		setTimeout(function () {
			const date = new Date(),
			Y = addZero(date.getFullYear()), M = addZero(date.getMonth()), D = addZero(date.getDate()), 
			h = addZero(date.getHours()), m = addZero(date.getMinutes()), s = addZero(date.getSeconds());
			
			let content = "";
			if(Boolean(typeFile) == true){
				let file = typeFile == 'image' ? `<img src='${UrlAttachment}/${AttachImage}' height='100px' width='260px'><br/> ${text} (click to download).` : `<i class='fa fa-file-text-o'></i>  ${text} (click to download).`;
				content = `<a href='${UrlAttachment}/${AttachImage}' target='_blank' class='text-warning'> ${file} </a>`;
				// content = `<a href='javascript:()' onclick='window.open("${typeFile},${AttachImage}", "_blank")' class='text-warning'> ${file} </a>`;
			}else{
				content = encodedAgentText;
			}
			
			let message = `<div class='direct-chat-msg'>
				<img class='direct-chat-img' src='dist/img/agent.png' alt='message user image'>
				<div class='direct-chat-text'>
					<div class='direct-chat-infos'>
						<span class='direct-chat-name float-left'>${encodedAgentName}</span>
						<span class='direct-chat-timestamp float-right'>${Y}-${M}-${D} ${h}:${m}:${s}</span>
					</div><br/>
					${content}
				</div>
			</div>`;

			$('#loading').remove();
			contain_message.innerHTML += message;
			$("#contain_chat").animate({
				scrollTop: contain_message.scrollHeight
			}, "fast");
			i++;
			
		}, 1000);
	};
	
	//queuing chat
	chat.client.ReturnQueueChat = function (obj) {
		// console.log(obj);
		let queuing = obj.Raw[0].Queue;
		
		let content = "<center>"+
		"Terima kasih telah menggunakan layanan Live Chat Sahabat BTN.<br/> Saat ini Anda sedang dalam antrian mohon tunggu beberapa saat.<br/> "+
		"<a href='javascript:getGreeting();' class='btn btn-success btn-sm btn-round'>Tetap Tunggu </a><br/>"+
		"atau<br/>"+
		"<a href='javascript:EndChatQue();' class='btn btn-danger btn-sm btn-round'>Akhiri Chat </a><br/>"+
		"</center>";
		
		if(queuing > 0){				
			let message = "<div class='direct-chat-msg'>"+
				"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
				"<div class='direct-chat-text'>"+
					$.trim(content) +
				"</div>"+
			"</div>";

			// $('#loading').remove();
			$('#contain_chat').append(message);
			$("#contain_chat").animate({
				scrollTop: contain_message.scrollHeight
			}, "fast");
		}
	};

	//queuing chat
	chat.client.ReturnPusher_Que = function (Type,ChatID, CustID, CustName, AgentID, AgentName, NoAntrian) {
		// console.log(Type,ChatID, CustID, CustName, AgentID, AgentName, NoAntrian);
	
		if (Type == "True") {
			$("#AgentID").val(AgentID);
			$("#AgentName").val(AgentName);
			$("#message").removeAttr('disabled');
			$("#btn_send").removeAttr('disabled');
			$("#file_attach").removeAttr('disabled');
			$("#btn_attachment").removeAttr('disabled');
			
			// $('#contain_chat').html("");
			if ($("#FlagChat").val() == "False"){				
				let content = "Kamu telah terhubung dengan : <b>" + AgentName +"</b>. Silahkan sampaikan pesan kamu.";
				let message = "<div class='direct-chat-msg'>"+
					"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
					"<div class='direct-chat-text'>"+
						$.trim(content) +
					"</div>"+
				"</div>";

				// $('#contain_chat').append(message);
				$('#contain_chat').html("");
				$('#contain_chat').html(message);
				$("#contain_chat").animate({
					scrollTop: contain_message.scrollHeight
				}, "fast");
			}
			
		}
		else {
			setTimeout(() => {
				if (CustName == $("#username").val()) {
					let content = "<p>Hai <b>"+$("#username").val()+"</b>, <br/>Terima kasih telah menggunakan layanan Live Chat Sahabat BTN.<br/> Saat ini Anda sedang dalam antrian ke <b>"+NoAntrian+"</b> mohon tunggu beberapa saat.<br/><br/></p>"+
					"<center>"+
						"<a href='javascript:getGreeting();' class='btn btn-success btn-sm btn-round'>Tetap Tunggu </a><br/>"+
						"atau<br/>"+
						"<a href='javascript:EndChatQue();' class='btn btn-danger btn-sm btn-round'>Akhiri Chat </a><br/><br/>"+
					"</center>";
								
					let message = "<div class='direct-chat-msg'>"+
						"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
						"<div class='direct-chat-text'>"+
							$.trim(content) +
						"</div>"+
					"</div>";
	
					$('#contain_chat').html("");
					$('#contain_chat').html(message);
				}
			}, 2000);
		} 
		
    };

	chat.client.ReturnAgentTyping = function (CustID, AgentId, message) {
		let encodedMsg = $('<div />').text(message).html();
	};

	$.connection.hub.start().done(function () {
		const status = getCookie('status');
		const jenis_chat = getCookie('jenis_chat');
		

		function Login(){
			$("#UserID").val($.connection.hub.id);
			$("#form_login").removeClass("show").addClass("hide").hide();
			$("#contain_chat").removeClass("hide").show();
			$("#contain_footer").removeClass("hide").show();
			$("#btn_setting").removeClass("hide").show();	
		}

		function Validation(){
			if(status == 'true'){
				Login();
				$('#username').val(getCookie('username'));
				$('#email').val(getCookie('email'));
				
				if (jenis_chat == 'Agent') {
					$("#JensChat").val("Agent");
					getChat("agent");
				}
				else{
					$("#JensChat").val("Bot");
					getChat("menu");
				}
				
			}
			console.log($('#username').val(),$('#email').val());
		}
		Validation();
		
		
		
		//form validation
		$("#form_login").on('submit', function(e){
            e.preventDefault();
            var form = $(this);
            form.parsley().validate();

            if (form.parsley().isValid()){
				const username = $('<div />').text($('#username').val()).html();
				const email = $('#email').val();
				if (username != "" && email != "") {
					Login();
					setCookie("username", username);
					setCookie("email", email);
					setCookie("status", true);
					setCookie("jenis_chat", "Bot");
					$("#JensChat").val("Bot");
					getChat("menu");	
				} 
				else {
					$('#email').focus();
				} 
				
				//tombol enter
				$("#email").keypress(function(e) {
					if(e.which == 13) {
						Login();
					}
				});
				return false;
            }
        });		
		
		
		//kirim Pesan
		function sendMessage(){
			const date = new Date(),
			Y = addZero(date.getFullYear()), M = addZero(date.getMonth()), D = addZero(date.getDate()), 
			h = addZero(date.getHours()), m = addZero(date.getMinutes()), s = addZero(date.getSeconds());
			const username = $('<div />').text($('#username').val()).html();
			const pesan = ($('#message').val()).replace(/\r?\n/g, '<br>');
			// const pesan = $('<div />').text($('#message').val()).html();

			if (pesan != "") {
				// let message_value = pesan;
				//change Bot to Agent
				if(pesan == "agent"){
					$("#JensChat").val("Agent");
					chat.server.loginCust($('#UserID').val(), username, $('#email').val(), $('#email').val());
				}
				//change Agnet to Bot
				if(pesan == "menu"){
					$("#JensChat").val("Bot");
				}
				
				if($("#JensChat").val() == "Agent"){
					let contain = "";
					let type_file = "";
					
					// if(pesan.split(" (")[0] == $('#NameResultbase64').val()){
					if(Boolean($('#SrcResultbase64').val()) == true){
						let file = "";
						type_file = (document.getElementById("file_attach").files[0].type).split('/')[0];
						
						if(type_file == "image"){
							file = "<img src='"+$('#SrcResultbase64').val()+"' height='100px' width='260px' /><br/>" + pesan;
						}else{
							file = pesan;
						}

						contain = `<a href='javascript:();' onclick='window.open("${$('#SrcResultbase64').val()}", "_blank");' class='text-warning'> ${file} </a>`;
						// contain = "<a href='"+$('#SrcResultbase64').val()+"' target='_blank' class='text-warning'>" + file + "</a>";
					}
					else{
						type_file = "";
						contain = pesan;
					}

					let html = `<div class='direct-chat-msg right'>
						<img class='direct-chat-img' src='dist/img/user.png' alt='message user image'>
						<div class='direct-chat-text'>
							<div class='direct-chat-infos'>
							<span class='direct-chat-name float-right'>${username}</span>
							  <span class='direct-chat-timestamp float-left'>${Y}-${M}-${D} ${h}:${m}:${s}</span>
							</div><br/>
							${contain} 
						</div>
					</div>`;

					contain_message.innerHTML += html;
					$('#message').val('').focus();
					$("#contain_chat").animate({
						scrollTop: contain_message.scrollHeight
					}, "fast");
					
					chat.server.sendMessageDataCust($('#chatID').val(), $('#UserID').val(), username, pesan, $("#AgentID").val(), $("#AgentName").val(), $("#NameResultbase64").val(), $("#Resultbase64").val(), $("#email").val(), type_file, D);
					
					//hapus file telah dikirim
					clearFile();
				}
				else{				
					let html = `<div class='direct-chat-msg right'>
						<img class='direct-chat-img' src='dist/img/user.png' alt='message user image'>
						<div class='direct-chat-text'>
							<div class='direct-chat-infos'>
							<span class='direct-chat-name float-right'>${username}</span>
							  <span class='direct-chat-timestamp float-left'>${Y}-${M}-${D} ${h}:${m}:${s}</span>
							</div><br/>
							${pesan} 
						</div>
					</div>`;

					contain_message.innerHTML += html;
					$('#message').val('').focus();
					$("#contain_chat").animate({
						scrollTop: contain_message.scrollHeight
					}, "fast");

					String.prototype.replaceAll = function (search, replacement) {
						let target = this;
						return target.split(search).join(replacement);
					}
					getChat(pesan.replaceAll('<br>', ' '));

					//insert chatbot
					// Insert_tChatBot($('#UserID').val(), getCookie('username'), 'Cust', pesan, getCookie('email'));
					clearFile();
				}
				
			} 
			else {
				$('#message').val('').focus();
			}
		}

		$("#btn_send").click(function () {
			if($('#message').val() != ""){
                sendMessage();
            }else{
                $('#message').focus();
            }
		});

		$("#message").keypress(function(e) {
            if(e.which == 13) {
                if($('#message').val() != ""){
                    sendMessage();
                }else{
                    $('#message').focus();
                }
            }
		}); 
	});
});


function endChat(){
	deleteAllCookies();
	if (Boolean($("#AgentID").val()) == true) {
		let pesan = "Customer telah mengakhiri percakapan ini.";
		chat.server.sendMessageDataCust($('#chatID').val(), $('#UserID').val(), $('#username').val(), pesan, $("#AgentID").val(), $("#AgentName").val(), '', '', $("#email").val(), '', '');
	}

	if($("#JensChat").val() == "Bot"){
		// EndChatQue();
		const config = {
			method: 'POST',
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify({
				Data1:"EndChatQue",
				Data2:$('#chatID').val(),
				Data3:$('#UserID').val(),
				Data4:$('#email').val(),
				Data5:""
			})
		}
		fetch(UrlWS + '/SP_SosialMedia', config).then(res => res.json()).then(res => console.log(res));
	}
	
	$('body').append('<div id="requestOverlay" class="loader-overlay"></div>'); 
	$("#requestOverlay").show();
	
	//back to login
	setTimeout(function () {
		$("#AgentID").val("");
		$("#AgentName").val("");
		$("#requestOverlay").hide();
		$('#FormFeedback').removeClass('hide').show();
		// location.reload();
	}, 3000);
	
}

function EndChatQue(){
	deleteAllCookies();
	const config = {
		method: 'POST',
		headers: {
			"Content-Type" : "application/json"
		},
		body: JSON.stringify({
			Data1:"EndChatQue",
			Data2:$('#chatID').val(),
			Data3:$('#UserID').val(),
			Data4:$('#email').val(),
			Data5:""
		})
	}
	fetch(UrlWS + '/SP_SosialMedia', config).then(res => res.json()).then(res => console.log(res));

	chat.server.endChat_User($('#UserID').val(), $("#AgentID").val(), $('#chatID').val());
	$('body').append('<div id="requestOverlay" class="loader-overlay"></div>'); 
	$("#requestOverlay").show();
	
	//back to login
	setTimeout(function () {
		$("#requestOverlay").hide();
		$('#FormFeedback').removeClass('hide').show();
		// location.reload();
	}, 3000);
}


/*
Function Chat Bot
Untuk diawal ketika customer akan chat dia akan di handle oleh bot, ketika sudah masuk kondisi bot tidak bisa menghandle
kembali maka chat akan di direct kepada customer
*/
function getChat(letPattern) {
	let d = new Date();
	let h = addZero(d.getHours());
	let m = addZero(d.getMinutes());
	let s = addZero(d.getSeconds());
	
	//change Bot to Agent
	if(letPattern == "agent"){
		setCookie("jenis_chat", "Agent");
		$("#JensChat").val("Agent");
		$('#contain_chat').html("");
		$("#message").attr('disabled','disabled');
		$("#btn_send").attr('disabled','disabled');
		$("#disconnectBtn").addClass("hide").hide();
		$("#btn_endchat").removeClass("hide").show();
		$("#info_note").addClass("hide").hide();
		
		chat.server.loginCust($('#UserID').val(), getCookie('username'), getCookie('email'), getCookie('email'));
		// chat.server.loginCust($('#UserID').val(), $('<div />').text($('#username').val()).html(), $('#email').val(), $('#email').val());
	}
	else{
		return fetch(url_chatbot + '/myservice.svc/chatbot/' + letPattern + '/invision/btn')
		.then((response) => response.json())
		.then((obj) => {

			String.prototype.replaceAll = function (search, replacement) {
				let target = this;
				return target.split(search).join(replacement);
			}

			let contentBalikan1 = obj.message;
			let contentBalikan2 = contentBalikan1.replaceAll('[', '<');
			let contentBalikan3 = contentBalikan2.replaceAll(']', '>');
			const PesanBot = contentBalikan3;

			//insert chatbot
			Insert_tChatBot($('#UserID').val(), getCookie('username'), 'Cust', letPattern, getCookie('email'));
			Insert_tChatBot($('#UserID').val(), 'Bot', 'Bot', PesanBot, getCookie('email'));

			//chat BOT
			const loading = "<div class='direct-chat-msg' id='loading'>"+
				"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
				"<div class='direct-chat-text'>"+
					"<img src='dist/img/loading.gif' width='30px'>" +
				"</div>"+
			"</div>";
			
			$(loading).appendTo($('#contain_chat'));
			$("#contain_chat").animate({
				scrollTop: contain_message.scrollHeight
			}, "fast");

			setTimeout(function () {
				let message = "<div class='direct-chat-msg'>"+
					"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
					"<div class='direct-chat-text'>"+
						PesanBot +
					"</div>"+
				"</div>";

				$('#loading').remove();
				// $('#contain_chat').append(message);
				contain_message.innerHTML += message;
				$("#contain_chat").animate({
					scrollTop: contain_message.scrollHeight
				}, "fast");
				i++;
				
			}, 1000 + (Math.random() * 20) * 100);
			
			//pilihan jika antrian que tidak 0
			if(letPattern == "agent"){
				setTimeout(function () {
					chat.server.queueChat($("#UserID").val());	
				}, 10000 + (Math.random() * 20) * 100);
				
			}else{}
		})
		.catch((error) => {
			console.error(error);
		});
	}
}


//greeting function
function getGreeting(){
	// alert("hallo");
	let d = new Date();
	let h = addZero(d.getHours());
	let m = addZero(d.getMinutes());
	
	// chat.server.loginCust($('#UserID').val(), $('#username').val(), $('#email').val(), $('#email').val());
	$('#contain_chat').html("");
	let loading = "<div class='direct-chat-msg' id='loading'>"+
		"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
		"<div class='direct-chat-text'>"+
			"<img src='dist/img/loading.gif' width='30px'>" +
		"</div>"+
	"</div>";
				  
	// $(loading).appendTo($('#contain_chat'));
	$("#contain_chat").animate({
		scrollTop: contain_message.scrollHeight
	}, "fast");
	
	let content = "Hai <b>"+$("#username").val()+"</b>, Selamat datang di Live Chat. Mohon tunggu balasan chat dari Agent Kami."

	// setTimeout(function () {
		let message = "<div class='direct-chat-msg'>"+
			"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
			"<div class='direct-chat-text'>"+
				$.trim(content) +
			"</div>"+
		"</div>";

		$('#loading').remove();
		$('#contain_chat').append(message);
		$("#contain_chat").animate({
			scrollTop: contain_message.scrollHeight
		}, "fast");
		i++;
		
		// setTimeout(function () {
		// 	chat.server.queueChat($("#UserID").val());	
		// }, 10000 + (Math.random() * 20) * 100);
		
	// }, 1000 + (Math.random() * 20) * 100);
	
	$("#message").attr('disabled','disabled');
	$("#btn_send").attr('disabled','disabled');
	$("#file_attach").attr('disabled','disabled');
	$("#btn_attachment").attr('disabled','disabled');
	$("#btn_setting").removeClass("hide").show();
}


function clickProfile(){
	$('#mnama').text($('#username').val());
	$('#muserid').text($('#UserID').val());
	$('#memail').text($('#email').val());

}


function base64(file, callback) {
	var coolFile = {};
	function readerOnload(e) {
		var base64 = btoa(e.target.result);
		coolFile.base64 = base64;
		callback(coolFile)
	};

	var reader = new FileReader();
	reader.onload = readerOnload;

	var file = file[0].files[0];
	coolFile.filetype = file.type;
	coolFile.size = file.size;
	coolFile.filename = file.name;
	reader.readAsBinaryString(file);
}


function encodeImageFileAsURL(element) {
	const file = element.files[0];
	const reader = new FileReader();
	const size = file.size;
	const type = (file.type).split('/')[0];
	const format = (file.name).split('.')[1];
	// console.log(format);

	let d = new Date();
	let year = d.getFullYear();
	let month = addZero(d.getMonth());
	let date = addZero(d.getDate());
	let h = addZero(d.getHours());
	let m = addZero(d.getMinutes());
	let s = addZero(d.getSeconds());
	const nama_file = `${year}${month}${date}${h}${m}${s}`;
	// console.log(nama_file);

	
	//console.log(size);
	if(size >= 2000000){
		// alert("File tidak bisa lebih dari 2MB.");
		let message = "<div class='direct-chat-msg'>"+
			"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
			"<div class='direct-chat-text'>"+
				"<div class='direct-chat-infos'>"+
					"<span class='direct-chat-name float-left'>Warning!</span><br/>"+
				"</div><br/>"+
				"File tidak bisa lebih dari 2MB."+
			"</div>"+
		"</div>";
		
		$('#contain_chat').append(message);
		$('#message').val('').focus();
		$("#contain_chat").animate({
			scrollTop: contain_message.scrollHeight
		}, "fast");
		
		//reset ulang
		clearFile();
	}
	else {
		if (type != "video") {
			reader.onloadend = function () {
				let solution = reader.result.split("base64,")[1];
				$("#Resultbase64").val(solution);
				$("#NameResultbase64").val(`${nama_file}.${format}`);
				$("#message").val(element.files[0].name +" ("+ (size / 1000).toFixed(2) +" KB)");
				$("#SrcResultbase64").val(reader.result);
				//console.log(reader.result);
			}
			reader.readAsDataURL(file);
		}
		else{
			let message = "<div class='direct-chat-msg'>"+
				"<img class='direct-chat-img' src='dist/img/bot.png' alt='message user image'>"+
				"<div class='direct-chat-text'>"+
					"<div class='direct-chat-infos'>"+
						"<span class='direct-chat-name float-left'>Warning!</span><br/>"+
					"</div><br/>"+
					"Format Video tidak bisa terkirim."+
				"</div>"+
			"</div>";
			
			$('#contain_chat').append(message);
			$('#message').val('').focus();
			$("#contain_chat").animate({
				scrollTop: contain_message.scrollHeight
			}, "fast");
			
			//reset ulang
			clearFile();
		}
	}
}


function clearFile() {
	$("#Resultbase64").val("");
	$("#NameResultbase64").val("");
	$("#message").val("");
	$("#SrcResultbase64").val("");
}

function addZero(x) {
	if (x < 10) {
		x = "0" + x;
	}
	return x;
}

function scrollToDownload() {
	if ($('.section-download').length != 0) {
		$("html, body").animate({
			scrollTop: $('.section-download').offset().top
		}, 1000);
	}
}


async function Insert_tChatBot(ValUserID, ValNama, ValFlagTo, ValPesan, ValEmail){
	String.prototype.replaceAll = function (search, replacement) {
		let target = this;
		return target.split(search).join(replacement);
	}

	const ValPesan1 = ValPesan.replaceAll('"', '');
	const ValPesan2 = ValPesan1.replaceAll("'", "|");

	const data = {
		UserID: ValUserID,
		Nama: ValNama,
		FlagTo: ValFlagTo,
		Pesan: ValPesan2,
		Email: ValEmail
	}
	// console.log(data);

	try {
		const config = {
			method: 'POST',
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify(data)
		}

		const res = await fetch(UrlWS + '/service/Sosmed_tChatBot', config);
		const obj = await res.json();
		if (res.ok) {
			// console.log(obj);
		}
	} 
	catch (error) {
		console.log('gagal insert');
	}
}

async function FeedbackSosmed(){
	const data = {
		ChatID:$("#chatID").val(),
		CustomerID:$("#UserID").val(),
		Name:$("#username").val(),
		Email:$("#email").val(),
		RatingValue:$("#my_rating").attr("data-rating"),
		RatingComment:$("#comments_rating").val(),
		JenisChat:$("#JensChat").val()
	}
	// console.log(data);

	try {
		const config = {
			method: 'POST',
			headers: {
				"Content-Type" : "application/json"
			},
			body: JSON.stringify(data)
		}

		const res = await fetch(UrlWS + '/service/Sosmed_Feedback', config);
		// const obj = await res.json();
		if (res.ok) {
			// alert('sukses')
			location.reload();
		}
	} 
	catch (error) {
		console.log(error);
	}
}

document.getElementById('FormFeedback').addEventListener('submit', (e) => {
    e.preventDefault();
    FeedbackSosmed();
});


