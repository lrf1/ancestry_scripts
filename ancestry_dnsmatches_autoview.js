// NOTE: MODIFY THE FOLLOWING LINES AS NEEDED
var doMatchLogging = true;
var waitTimeScroll = 3000;
// NO CHANGES BELOW THIS LINE!!!
(async() => {
	var matchesViewed = 0;
	var matchList = document.getElementsByTagName("match-entry");
	mainloop: for (let matchIdx = 0; matchIdx < matchList.length; matchIdx++) {
        let newTag = matchList[matchIdx].getElementsByClassName("indicatorNew");
        if (newTag.length) {
            if (doMatchLogging)
               console.warn("%cUnviewed list entry #" + (matchIdx+1) + " "
                    + document.getElementsByTagName("match-entry")[matchIdx].getElementsByClassName("userCardImg")[0].title, "background: #222; color: #bada55");
            matchList[matchIdx].getElementsByClassName("userCardTitle")[0].click();
            while(document.getElementsByClassName("commonAncestors").length == 0) {await new Promise(r => setTimeout(r, 500));}
            let pgh = document.getElementsByClassName("pageHeader");
            pgh[0].getElementsByClassName("ancBtn")[0].click();
            //while(document.getElementsByTagName("match-entry").length == 0) { await new Promise(r => setTimeout(r, 500));}
            await new Promise(r => setTimeout(r, 2000));
            matchesViewed++;
        } else {
            if (doMatchLogging)
                console.warn("%cSkipping match list entry #" + (matchIdx+1) + " "
                   + document.getElementsByTagName("match-entry")[matchIdx].getElementsByClassName("userCardImg")[0].title, "color: #cccccc");
        }

        if (matchIdx % 50 === 0) {
            window.scrollTo(0, window.document.body.scrollHeight);
            await new Promise(r => setTimeout(r, waitTimeScroll));
        }
		
	}
	console.warn("Done visiting matches - a total of " + matchList.length + " matches have been viewed. Last script run visited " + matchesViewed + " matches.");
}) ()
