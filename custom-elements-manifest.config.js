import { readFileSync } from 'fs';

// Custom Elements Manifest configuration
export default {
  globs: ['dist/*.js', '!dist/*.min.js'],
  outDir: './',
  plugins: [
    // Add JSDoc comments support
    {
      name: 'jsdoc-plugin',
      analyzePhase({ts, node, moduleDoc}) {
        // Extract JSDoc comments for better documentation
        if (ts.isClassDeclaration(node) && node.jsDoc) {
          const jsDoc = node.jsDoc[0];
          if (jsDoc && jsDoc.comment) {
            const classDoc = moduleDoc.declarations?.find(d => d.name === node.name.text);
            if (classDoc) {
              classDoc.description = jsDoc.comment;
            }
          }
        }
      }
    }
  ]
};