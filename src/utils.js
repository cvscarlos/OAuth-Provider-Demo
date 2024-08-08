import Handlebars from 'handlebars';
import fs from 'node:fs';

const layoutDir = './src/layout';
const layout = fs.readFileSync(`${layoutDir}/layout.hbs`, 'utf8');
const layoutHandler = Handlebars.compile(layout);

export function htmlTemplate(content, layoutFile) {
	const template = fs.readFileSync(layoutDir + layoutFile, 'utf8');
	const templateHandler = Handlebars.compile(template);

	const pageContent = templateHandler(content);
	return layoutHandler({ pageContent });
}
