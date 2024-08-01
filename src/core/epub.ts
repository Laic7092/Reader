// 利用zip.js，读取并解析epub文件
// 然依次解析`container.xml`,`opf`,`导航文件`
import { BlobReader, ZipReader, TextWriter, BlobWriter } from '@zip.js/zip.js';

// 定义 EPUB 中可能的文件类型枚举
enum FileType {
    xml = 'application/xml',
    xhtml = 'application/xhtml+xml',
    html = 'text/html',
    css = 'text/css',
    image = 'image/',
    ncx = 'application/x-dtbncx+xml'
}

const CONTAINER_XML = 'META-INF/container.xml'

// 处理 EPUB 文件的函数
export const handleEpub = async (file: File) => {
    // 使用 BlobReader 读取文件
    const zipFileReader = new BlobReader(file);
    const zipReader = new ZipReader(zipFileReader);

    try {
        // 获取 EPUB 文件中的所有条目（文件）
        const entries = await zipReader.getEntries();
        console.log(entries)
        const container = entries.find(entry => entry.filename === CONTAINER_XML)

        if (container) {
            const opfPath = parseContainerXML(container.getData && await container.getData(new TextWriter()))

            const opf = entries.find(entry => entry.filename === opfPath)

            if (opf) {
                const opfData = parseOPF(opf.getData && await opf.getData(new TextWriter()))

                // Read NCX or HTML nav file
                const navFile = opfData.manifest.find(item => item.id === "ncx" || item.href.includes("toc"));
                if (navFile) {
                    const navEntry = entries.find(entry => entry.filename.includes(navFile.href))
                    const navContent = navEntry && navEntry.getData && await navEntry?.getData(new TextWriter())
                    let navMap;
                    if (navFile.mediaType === FileType.ncx) {
                        navMap = parseNCX(navContent);
                    } else if (navFile.mediaType === FileType.xhtml) {
                        navMap = parseHTMLNav(navContent);
                    }
                }

                const iframe = document.createElement('iframe')
                // const p1 = await entries[5].getData(new TextWriter())
                // const item = new DOMParser().parseFromString(p1, "application/xhtml+xml")

                // const innerUrl = URL.createObjectURL(p1)
                // iframe.innerHTML = item

                const p1 = await entries[5].getData(new BlobWriter(FileType.xhtml))
                debugger
                iframe.setAttribute('src', URL.createObjectURL(p1))
                iframe.width = '500px'
                iframe.height = '500px'
                iframe.setAttribute('sandBox', '')
                document.body.appendChild(iframe)
            }
        }
    } catch (error) {
        console.error('Error handling EPUB:', error);
    } finally {
        // 关闭 ZipReader，释放资源
        zipReader.close();
    }
}

// Function to parse container.xml
function parseContainerXML(xmlContent) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

    // Extract the path to the OPF file
    const rootfile = xmlDoc.getElementsByTagName("rootfile")[0];
    const opfPath = rootfile.getAttribute("full-path");

    return opfPath;
}

// Function to parse NCX XML content
function parseNCX(xmlContent) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

    const navMap = [];
    const navPoints = xmlDoc.getElementsByTagName("navPoint");
    for (let navPoint of navPoints) {
        const id = navPoint.getAttribute("id");
        const playOrder = navPoint.getAttribute("playOrder");
        const label = navPoint.getElementsByTagName("navLabel")[0].textContent.trim();
        const contentSrc = navPoint.getElementsByTagName("content")[0].getAttribute("src");

        navMap.push({
            id,
            playOrder,
            label,
            contentSrc
        });
    }

    import.meta.env.DEV && console.log('nav', navMap)

    return navMap;
}

// Function to parse HTML navigation content
function parseHTMLNav(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const navMap = [];
    const toc = doc.querySelector('nav[epub\\:type="toc"]');
    if (toc) {
        const items = toc.querySelectorAll("ol > li > a");
        for (let item of items) {
            navMap.push({
                href: item.getAttribute("href"),
                text: item.textContent.trim()
            });
        }
    }


    import.meta.env.DEV && console.log('nav', navMap)

    return navMap;
}


// Function to parse OPF XML content
function parseOPF(xmlContent) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

    // Parse metadata
    const metadata = {};
    const metadataElements = xmlDoc.getElementsByTagName("metadata")[0].children;
    for (let element of metadataElements) {
        const tagName = element.tagName.split(":").pop(); // Handle namespaced tags
        metadata[tagName] = element.textContent;
    }

    // Parse manifest
    const manifest = [];
    const manifestElements = xmlDoc.getElementsByTagName("manifest")[0].children;
    for (let element of manifestElements) {
        manifest.push({
            id: element.getAttribute("id"),
            href: element.getAttribute("href"),
            mediaType: element.getAttribute("media-type")
        });
    }

    // Parse spine
    const spine = [];
    const spineElements = xmlDoc.getElementsByTagName("spine")[0].children;
    for (let element of spineElements) {
        spine.push(element.getAttribute("idref"));
    }

    // Parse guide (optional)
    const guide = [];
    const guideElements = xmlDoc.getElementsByTagName("guide")[0]?.children || [];
    for (let element of guideElements) {
        guide.push({
            type: element.getAttribute("type"),
            title: element.getAttribute("title"),
            href: element.getAttribute("href")
        });
    }

    import.meta.env.DEV && console.log('opf', {
        metadata,
        manifest,
        spine,
        guide
    })

    // Return parsed data
    return {
        metadata,
        manifest,
        spine,
        guide
    };
}

