//META{"name":"OwnerTag","website":"https://github.com/mwittrien/BetterDiscordAddons/tree/master/Plugins/OwnerTag","source":"https://raw.githubusercontent.com/mwittrien/BetterDiscordAddons/master/Plugins/OwnerTag/OwnerTag.plugin.js"}*//

class OwnerTag {
	getName () {return "OwnerTag";}

	getVersion () {return "1.0.9";}

	getAuthor () {return "DevilBro";}

	getDescription () {return "Adds a Tag like Bottags to the Serverowner.";}

	initConstructor () {
		this.changelog = {
			"added":[["Admin Tags","You can now enable the plugin to also add tags for users with administration rights, you can also set a unique tagname for such people"]]
		};
		
		this.patchModules = {
			"NameTag":["componentDidMount","componentDidUpdate"],
			"MessageUsername":["componentDidMount","componentDidUpdate"],
			"StandardSidebarView":"componentWillUnmount"
		};

		this.defaults = {
			settings: {
				addInChatWindow:		{value:true, 	inner:true,		description:"Messages"},
				addInMemberList:		{value:true, 	inner:true,		description:"Member List"},
				addInUserPopout:		{value:true, 	inner:true,		description:"User Popouts"},
				addInUserProfil:		{value:true, 	inner:true,		description:"User Profile Modal"},
				useRoleColor:			{value:true, 	inner:false,	description:"Use the Rolecolor instead of the default blue."},
				useBlackFont:			{value:false, 	inner:false,	description:"Instead of darkening the Rolecolor on bright colors use black font."},
				useCrown:				{value:false, 	inner:false,	description:"Use the Crown OwnerIcon instead of the OwnerTag."},
				addForAdmins:			{value:false, 	inner:false,	description:"Also add the Tag for any user with Admin rights."}
			},
			inputs: {
				ownTagName:				{value:"Owner", 	description:"Owner Tag Text for Owners"},
				ownAdminTagName:		{value:"Admin", 	description:"Owner Tag Text for Admins"}
			}
		};
	}

	getSettingsPanel () {
		if (!global.BDFDB || typeof BDFDB != "object" || !BDFDB.loaded || !this.started) return;
		var settings = BDFDB.getAllData(this, "settings"); 
		var inputs = BDFDB.getAllData(this, "inputs"); 
		var settingshtml = `<div class="${this.name}-settings DevilBro-settings"><div class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.title + BDFDB.disCNS.size18 + BDFDB.disCNS.height24 + BDFDB.disCNS.weightnormal + BDFDB.disCN.marginbottom8}">${this.name}</div><div class="DevilBro-settings-inner">`;
		for (let key in inputs) {
			settingshtml += `<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;"><h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.title + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCN.flexchild}" style="flex: 0 0 50%;">${this.defaults.inputs[key].description}</h3><div class="${BDFDB.disCNS.inputwrapper + BDFDB.disCNS.vertical + BDFDB.disCNS.flex + BDFDB.disCN.directioncolumn}" style="flex: 1 1 auto;"><input type="text" option="${key}" value="${inputs[key]}" placeholder="${this.defaults.inputs[key].value}" class="${BDFDB.disCNS.inputdefault + BDFDB.disCNS.input + BDFDB.disCN.size16}"></div></div>`;
		}
		for (let key in settings) {
			if (!this.defaults.settings[key].inner) settingshtml += `<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;"><h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.title + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">${this.defaults.settings[key].description}</h3><div class="${BDFDB.disCNS.flexchild + BDFDB.disCNS.switchenabled + BDFDB.disCNS.switch + BDFDB.disCNS.switchvalue + BDFDB.disCNS.switchsizedefault + BDFDB.disCNS.switchsize + BDFDB.disCN.switchthemedefault}" style="flex: 0 0 auto;"><input type="checkbox" value="settings ${key}" class="${BDFDB.disCNS.switchinnerenabled + BDFDB.disCN.switchinner} settings-switch"${settings[key] ? " checked" : ""}></div></div>`;
		}
		settingshtml += `<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;"><h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.title + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCN.flexchild}" style="flex: 0 0 auto;">Add Owner Tag in:</h3></div><div class="DevilBro-settings-inner-list">`;
		for (let key in settings) {
			if (this.defaults.settings[key].inner) settingshtml += `<div class="${BDFDB.disCNS.flex + BDFDB.disCNS.flex2 + BDFDB.disCNS.horizontal + BDFDB.disCNS.horizontal2 + BDFDB.disCNS.directionrow + BDFDB.disCNS.justifystart + BDFDB.disCNS.aligncenter + BDFDB.disCNS.nowrap + BDFDB.disCN.marginbottom8}" style="flex: 1 1 auto;"><h3 class="${BDFDB.disCNS.titledefault + BDFDB.disCNS.title + BDFDB.disCNS.marginreset + BDFDB.disCNS.weightmedium + BDFDB.disCNS.size16 + BDFDB.disCNS.height24 + BDFDB.disCN.flexchild}" style="flex: 1 1 auto;">${this.defaults.settings[key].description}</h3><div class="${BDFDB.disCNS.flexchild + BDFDB.disCNS.switchenabled + BDFDB.disCNS.switch + BDFDB.disCNS.switchvalue + BDFDB.disCNS.switchsizedefault + BDFDB.disCNS.switchsize + BDFDB.disCN.switchthemedefault}" style="flex: 0 0 auto;"><input type="checkbox" value="settings ${key}" class="${BDFDB.disCNS.switchinnerenabled + BDFDB.disCN.switchinner} settings-switch"${settings[key] ? " checked" : ""}></div></div>`;
		}
		settingshtml += `</div>`;
		settingshtml += `</div></div>`;

		let settingspanel = BDFDB.htmlToElement(settingshtml);

		BDFDB.initElements(settingspanel, this);

		BDFDB.addEventListener(this, settingspanel, "keyup", BDFDB.dotCN.input, () => {this.saveInputs(settingspanel);});

		return settingspanel;
	}

	//legacy
	load () {}

	start () {
		if (!global.BDFDB) global.BDFDB = {myPlugins:{}};
		if (global.BDFDB && global.BDFDB.myPlugins && typeof global.BDFDB.myPlugins == "object") global.BDFDB.myPlugins[this.getName()] = this;
		var libraryScript = document.querySelector('head script[src="https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js"]');
		if (!libraryScript || performance.now() - libraryScript.getAttribute("date") > 600000) {
			if (libraryScript) libraryScript.remove();
			libraryScript = document.createElement("script");
			libraryScript.setAttribute("type", "text/javascript");
			libraryScript.setAttribute("src", "https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDFDB.js");
			libraryScript.setAttribute("date", performance.now());
			libraryScript.addEventListener("load", () => {if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) this.initialize();});
			document.head.appendChild(libraryScript);
		}
		else if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) this.initialize();
		this.startTimeout = setTimeout(() => {this.initialize();}, 30000);
	}

	initialize () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			if (this.started) return;
			BDFDB.loadMessage(this);

			this.MemberUtils = BDFDB.WebModules.findByProperties("getMembers", "getMember");
			this.GuildUtils = BDFDB.WebModules.findByProperties("getGuilds","getGuild");
			this.ChannelUtils = BDFDB.WebModules.findByProperties("getChannels","getChannel");
			this.LastChannelStore = BDFDB.WebModules.findByProperties("getLastSelectedChannelId");

			BDFDB.WebModules.forceAllUpdates(this);
		}
		else {
			console.error(`%c[${this.getName()}]%c`, 'color: #3a71c1; font-weight: 700;', '', 'Fatal Error: Could not load BD functions!');
		}
	}

	stop () {
		if (global.BDFDB && typeof BDFDB === "object" && BDFDB.loaded) {
			BDFDB.removeEles(".owner-tag, .owner-tag-crown");
			BDFDB.unloadMessage(this);
		}
	}


	// begin of own functions

	saveInputs (settingspanel) {
		let inputs = {};
		for (let input of settingspanel.querySelectorAll(BDFDB.dotCN.input)) {
			inputs[input.getAttribute("option")] = input.value;
		}
		BDFDB.saveAllData(inputs, this, "inputs");
		this.SettingsUpdated = true;
	}

	processNameTag (instance, wrapper) {
		let container = null;
		if (!instance.props || !wrapper.classList) return;
		else if (BDFDB.containsClass(wrapper, BDFDB.disCN.membernametag) && BDFDB.getData("addInMemberList", this, "settings")) {
			this.addOwnerTag(instance.props.user, null, wrapper, "list", BDFDB.disCN.bottagnametag + (instance.props.botClass ? (" " + instance.props.botClass) : ""), container);
		}
		else if ((container = BDFDB.getParentEle(BDFDB.dotCN.userpopout, wrapper)) != null && BDFDB.getData("addInUserPopout", this, "settings")) {
			this.addOwnerTag(instance.props.user, null, wrapper, "popout", BDFDB.disCN.bottagnametag + (instance.props.botClass ? (" " + instance.props.botClass) : ""), container);
		}
		else if ((container = BDFDB.getParentEle(BDFDB.dotCN.userprofile, wrapper)) != null && BDFDB.getData("addInUserProfil", this, "settings")) {
			this.addOwnerTag(instance.props.user, null, wrapper, "profile", BDFDB.disCN.bottagnametag + (instance.props.botClass ? (" " + instance.props.botClass) : ""), container);
		}
	}

	processMessageUsername (instance, wrapper, methodnames) {
		let message = BDFDB.getReactValue(instance, "props.message");
		if (message && BDFDB.getData("addInChatWindow", this, "settings")) {
			let username = wrapper.querySelector(BDFDB.dotCN.messageusername);
			if (username) {
				let messagegroup = BDFDB.getParentEle(BDFDB.dotCN.messagegroup, wrapper);
				this.addOwnerTag(message.author, message.channel_id, username.parentElement, "chat", BDFDB.disCN.bottagmessage + " " + (BDFDB.containsClass(messagegroup, BDFDB.disCN.messagegroupcozy) ? BDFDB.disCN.bottagmessagecozy : BDFDB.disCN.bottagmessagecompact), null);
			}
		}
	}

	processStandardSidebarView (instance, wrapper) {
		if (this.SettingsUpdated) {
			delete this.SettingsUpdated;
			BDFDB.removeEles(".owner-tag, .owner-tag-crown");
			BDFDB.WebModules.forceAllUpdates(this);
		}
	}

	addOwnerTag (info, channelid, wrapper, type, selector = "", container) {
		if (!info || !wrapper || !wrapper.parentElement) return;
		BDFDB.removeEles(wrapper.querySelectorAll(".owner-tag, .owner-tag-crown"));
		let channel = this.ChannelUtils.getChannel(channelid || this.LastChannelStore.getChannelId());
		if (!channel) return;
		let guild = this.GuildUtils.getGuild(channel.guild_id);
		let settings = BDFDB.getAllData(this, "settings");
		let isowner = channel.ownerId == info.id || guild && guild.ownerId == info.id;
		if (!(isowner || (settings.addForAdmins && BDFDB.isUserAllowedTo("ADMINISTRATOR", info.id)))) return;
		let member = settings.useRoleColor ? (this.MemberUtils.getMember(channel.guild_id, info.id) || {}) : {};
		let EditUsersData = BDFDB.isPluginEnabled("EditUsers") ? bdplugins.EditUsers.plugin.getUserData(info.id, wrapper) : {};
		if (!settings.useCrown) {
			let tag = BDFDB.htmlToElement(`<span class="owner-tag ${isowner ? "owner-tag-owner" : "owner-tag-admin"} owner-${type}-tag ${(settings.useRoleColor ? "owner-tag-rolecolor " : "") + BDFDB.disCN.bottag + (selector ? (" " + selector) : "")}" style="order: 10 !important;">${BDFDB.getData(isowner ? "ownTagName" : "ownAdminTagName", this, "inputs")}</span>`);
			let invert = false;
			if (container && container.firstElementChild && !BDFDB.containsClass(container.firstElementChild, BDFDB.disCN.userpopoutheadernormal, BDFDB.disCN.userprofiletopsectionnormal), false) invert = true;
			BDFDB.addClass(tag, invert ? BDFDB.disCN.bottaginvert : BDFDB.disCN.bottagregular);
			let tagcolor = BDFDB.colorCONVERT(EditUsersData.color1 || member.colorString, "RGB");
			let isbright = BDFDB.colorISBRIGHT(tagcolor);
			tagcolor = isbright ? (settings.useBlackFont ? tagcolor : BDFDB.colorCHANGE(tagcolor, -0.3)) : tagcolor;
			tag.style.setProperty(invert ? "color" : "background-color", tagcolor, "important");
			if (isbright && settings.useBlackFont) tag.style.setProperty(invert ? "background-color" : "color", "black", "important");
			wrapper.insertBefore(tag, wrapper.querySelector(".TRE-tag,svg[name=MobileDevice]"));
		}
		else if (!wrapper.querySelector(BDFDB.dotCN.ownericon)) {
			let crown = BDFDB.htmlToElement(`<svg name="Crown" class="owner-tag-crown ${isowner ? "owner-tag-owner" : "owner-tag-admin"} ${BDFDB.disCNS.ownericon + BDFDB.disCN.memberownericon}" width="24" height="24" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path fill="${isowner ? "#faa61a" : "#b3b3b3"}" fill-rule="nonzero" d="M2,11 L0,0 L5.5,7 L9,0 L12.5,7 L18,0 L16,11 L2,11 L2,11 Z M16,14 C16,14.5522847 15.5522847,15 15,15 L3,15 C2.44771525,15 2,14.5522847 2,14 L2,13 L16,13 L16,14 Z" transform="translate(3 4)"></path><rect width="24" height="24"></rect></g></svg>`);
			crown.addEventListener("mouseenter", () => {
				BDFDB.createTooltip(isowner ? (channel.type == 3 ? BDFDB.LanguageStrings.GROUP_OWNER : BDFDB.LanguageStrings.GUILD_OWNER) : BDFDB.LanguageStrings.ADMINISTRATOR, crown, {type: "top"});
			});
			wrapper.insertBefore(crown, wrapper.querySelector(".TRE-tag,svg[name=MobileDevice]"));
		}
	}
}
