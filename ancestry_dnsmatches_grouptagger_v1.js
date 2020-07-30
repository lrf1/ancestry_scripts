(async() => {
	var matchList = document.getElementsByTagName("match-entry");
	var matchesTagged = 0;
	var matchesSkipped = 0;
	// NOTE: CHANGE THE BELOW GROUP NAME
	var groupTitle = "To be removed";
	mainloop: for (let i = 0; i < matchList.length; i++) {
		let presentGroups = matchList[i].getElementsByClassName("indicatorGroup");
		for (let j = 0; j < presentGroups.length; j++) {
			let title = presentGroups[j].title;
			if (groupTitle.localeCompare(title.toString()) == 0) {
				matchesSkipped++;
				if (matchesSkipped == matchList.length) {
					// We've skipped all loaded matches since they are all tagged
					// Now start scrolling until we find an untagged match
					// Note: 1000 iterations will eventually load 50000 matches. Change as needed
					for (let l = 0; l < 1000; l++) {
						window.scrollTo(0, window.document.body.scrollHeight);
						await new Promise(r => setTimeout(r, 3000));
						// Check last match and see if it's tagged
						let newLength = matchList.length;
						console.warn("New match list length = " + newLength);
						presentGroups = matchList[newLength-1].getElementsByClassName("indicatorGroup");
						let tagged = false;
						for (let k = 0; k < presentGroups.length; k++) {
							if (groupTitle.localeCompare(presentGroups[k].title.toString()) == 0) {
								tagged = true;
							}
						}
						if (!tagged) break;
					}
				}
				continue mainloop;
			}
		}
		let btn = matchList[i].getElementsByClassName("groupAddBtn");
		btn[1].click();
		await new Promise(r => setTimeout(r, 250));
		var popup = document.getElementsByClassName("calloutContent");	
		var choices = popup.item(0).getElementsByTagName("li");
		// NOTE: REPLACE BELOW BRACKETED VALUE WITH ACTUAL ROW TO USE - STAR = 1, FIRST CUSTOM GROUP = 2, ETC
		var myTag = choices[2].getElementsByClassName("checkbox");
		if (!myTag[0].checked) {
			myTag[0].click();
	        await new Promise(r => setTimeout(r, 1000)); // Allow the request to finish
			matchesTagged++;
		}
		btn[1].click();
	}
	console.warn("Tagging done - a total of " + matchList.length + " matches have been tagged. Last script run tagged " + matchesTagged + " matches.");
}) ()