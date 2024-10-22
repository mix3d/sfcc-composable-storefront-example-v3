const fs = require('fs')
const path = require('path')

export function printDirectoryTree(dir, prefix = '') {
    const files = fs.readdirSync(dir)

    files.forEach((file, index) => {
        const filePath = path.join(dir, file)
        const stats = fs.statSync(filePath)
        const isLast = index === files.length - 1

        console.log(prefix + (isLast ? '└── ' : '├── ') + file)

        if (stats.isDirectory()) {
            printDirectoryTree(filePath, prefix + (isLast ? '    ' : '│   '))
        }
    })
}
