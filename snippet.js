(function() {
    console.log('Starting Claude in Chrome conversation export...');

    // --- Build the Markdown document header ---
    let markdown = '# Claude in Chrome Conversation Export\n\n';
    markdown += `Exported at: ${new Date().toLocaleString('en-US')}\n\n`;
    markdown += `---\n\n`;

    // --- Primary selector: look for message containers by class pattern ---
    const messageContainers = document.querySelectorAll('[class*="group/message"]');

    if (messageContainers.length === 0) {
        console.log('group/message not found — falling back to alternative selectors...');

        // Fallback: target Claude response bodies and user message elements directly
        const responses = document.querySelectorAll('.font-claude-response-body, [class*="response-body"]');
        const userMessages = document.querySelectorAll('[class*="user-message"], [class*="font-base"]');

        console.log(`Found ${responses.length} Claude replies`);
        console.log(`Found ${userMessages.length} user messages`);

        // Scan all <p> and <div> elements to extract messages in DOM order
        const allElements = document.querySelectorAll('p, div');
        const messages = [];

        allElements.forEach(el => {
            const text = el.textContent?.trim();
            // Skip empty or very short fragments — likely UI chrome, not conversation content
            if (!text || text.length < 10) return;

            const classList = el.className || '';
            const isResponse = classList.includes('response-body') || classList.includes('claude');
            const isUser   = classList.includes('user') || classList.includes('font-base');

            if (isResponse || isUser) {
                messages.push({
                    role: isUser ? '👤 User' : '🤖 Claude',
                    text: text,
                    element: el
                });
            }
        });

        // Last-resort fallback: walk every text node in the document
        if (messages.length === 0) {
            console.log('No role-matched elements found — extracting raw text nodes...');

            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null
            );

            let node;
            while (node = walker.nextNode()) {
                const text = node.textContent?.trim();
                // Only keep substantial text; skip short fragments and debug output
                if (text && text.length > 20 && !text.startsWith('Debug')) {
                    messages.push({
                        role: '💬 Message',
                        text: text
                    });
                }
            }
        }

        // Deduplicate: the DOM often nests the same text in parent and child elements
        const uniqueMessages = [];
        const seenTexts = new Set();

        messages.forEach(msg => {
            if (!seenTexts.has(msg.text)) {
                seenTexts.add(msg.text);
                uniqueMessages.push(msg);
            }
        });

        console.log(`Extracted ${uniqueMessages.length} unique messages`);

        // Append each message as a Markdown section
        uniqueMessages.forEach((msg) => {
            markdown += `## ${msg.role}\n\n${msg.text}\n\n---\n\n`;
        });

    } else {
        // Primary path: iterate over the found message containers
        console.log(`Found ${messageContainers.length} message containers`);

        messageContainers.forEach((container) => {
            const text = container.textContent?.trim();
            if (!text) return;

            // Heuristic: if the container holds a child with a "user" class, treat it as a user turn
            const isUser = container.querySelector('[class*="user"]') !== null;
            const role   = isUser ? '👤 User' : '🤖 Claude';

            markdown += `## ${role}\n\n${text}\n\n---\n\n`;
        });
    }

    // --- Trigger a file download with the assembled Markdown ---
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url;

    // Filename includes an ISO timestamp for easy sorting and uniqueness
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    a.download = `claude-conversation-${timestamp}.md`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    console.log('✅ Export complete. Filename:', a.download);
    alert(`✅ Conversation exported successfully!\nFilename: ${a.download}`);
})();
