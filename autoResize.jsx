{
    // Configuration: Map of base comp sizes to target resize options with custom names
var resizeConfig = {
        "2880x960": [
            { width: 1344, height: 448, name: "KRSNRSK" },
            { width: 1800, height: 600, name: "DSS_1800x600" },
            { width: 1152, height: 384, name: "DSS_1152x384" },
            { width: 1440, height: 480, name: "DSS_1440x480" },
            { width: 1080, height: 360, name: "DSS_1080x360" },
            { width: 900,  height: 300, name: "DSS_900x300"  },
            { width: 864,  height: 288, name: "DSS_864x288"  },
            { width: 720,  height: 256, name: "CHE" },
            { width: 2088, height: 768, name: "NVSB" },
            { width: 960,  height: 360, name: "Konstr" },
            { width: 1120, height: 432, name: "NN" },
            { width: 940,  height: 300, name: "DSS_940x300" },
            { width: 1410, height: 450, name: "DSS_1410x450" },
            { width: 1536, height: 480, name: "DSS_1536x480" },
            { width: 960,  height: 300, name: "DSS_960x300"  }
        ],
        "3200x1472": [
            { width: 2368, height: 1088, name: "Salaris_2368" },
            { width: 480,  height: 216, name: "NVSB_480" },
            { width: 1536, height: 672, name: "DSS_1536x672" },
            { width: 1920, height: 832, name: "Ufa" },
            { width: 1216, height: 512, name: "EKB_Rad" },
            { width: 1184, height: 496, name: "DSS_1184x496" },
            { width: 1536, height: 640, name: "Himki" },
            { width: 1536, height: 640, name: "DSS_1536x640" },
            { width: 1408, height: 576, name: "Himki_Molodezh" },
            { width: 1408, height: 576, name: "Krasno_1408" }
        ],
        "1536x864": [
            { width: 1680, height: 960, name: "ORNBRG" },
            { width: 1056, height: 608, name: "Choko" },
            { width: 1080, height: 640, name: "KRSNDR" },
            { width: 600,  height: 360, name: "DSS_600x360" },
            { width: 1440, height: 864, name: "5 Planet" },
            { width: 1400, height: 860, name: "KZN" },
            { width: 576,  height: 320, name: "DSS_576x320" },
            { width: 1152, height: 640, name: "Salaris_1152" },
            { width: 1152, height: 640, name: "Moy Mall" },
            { width: 1920, height: 1056, name: "VRNZH_20" },
            { width: 704,  height: 384, name: "DSS_704x384" },
            { width: 1056, height: 576, name: "DSS_1056x576" },
            { width: 1056, height: 576, name: "ANR_1056" },
            { width: 1408, height: 768, name: "Kievskaya_1408" },
            { width: 1408, height: 768, name: "Himki_Grand_1408" }
        ],
        "3456x576": [
            { width: 2520, height: 440, name: "NVSB_2520" },
            { width: 1740, height: 280, name: "Avto" },
            { width: 3168, height: 384, name: "Atlantis" },
            { width: 4200, height: 600, name: "Ibis" },
            { width: 3840, height: 480, name: "SPb CAD 23km" },
            { width: 1952, height: 288, name: "Riv_1952" }
        ],
         "1104x288": [
            { width: 2368, height: 640, name: "Kutuzovsky" },
            { width: 672,  height: 184, name: "Horosho_672" },
            { width: 2624, height: 672, name: "Mozhaika_B" },
            { width: 1920, height: 480, name: "VLDVSTK" }
        ],
        "864x432": [
            { width: 720,  height: 360, name: "DSS_720x360" },
            { width: 864,  height: 432, name: "Grand_864" },
            { width: 768,  height: 384, name: "DSS_768x384" },
            { width: 960,  height: 480, name: "DSS_960x480" },
            { width: 480,  height: 240, name: "VRNZH_Patriotov" },
            { width: 1152, height: 576, name: "DSS_1152x576" },
            { width: 1280, height: 640, name: "PRM" },
            { width: 1280, height: 640, name: "Sochi MoreMoll_1280" }
        ],
        "880x560": [
            { width: 704,  height: 464, name: "Horosho_704" },
            { width: 768,  height: 512, name: "KuchniPark_768" },
            { width: 832,  height: 576, name: "Omsk_832" },
            { width: 2304, height: 1600, name: "Volgogradka" },
            { width: 1600, height: 1120, name: "DSS_1600x1120" },
            { width: 800,  height: 560, name: "DSS_800x560" }
        ],
         "896x704": [
            { width: 832,  height: 640, name: "SMR_Aurora" },
            { width: 720,  height: 540, name: "DSS_720x540" },
            { width: 576,  height: 432, name: "DSS_576x432" },
            { width: 768,  height: 576, name: "DSS_768x576" },
            { width: 600,  height: 448, name: "EKB" },
            { width: 660,  height: 480, name: "KRSNDR_660" }
        ],
         "960x1728": [
            { width: 384,  height: 686, name: "SPb_384x686" },
            { width: 384,  height: 672, name: "Kievskaya_384" },
            { width: 1120, height: 1920, name: "HBRVSK_Mur-Amur" },
            { width: 816,  height: 1408, name: "Hanoy" },
            { width: 640,  height: 1088, name: "Gorod_640" },
            { width: 480,  height: 820, name: "BZLK" }
        ],
        "960x2016": [
            { width: 640,  height: 1344, name: "NN_Komsa 1A" },
            { width: 896,  height: 1920, name: "Altushka" },
            { width: 192,  height: 416, name: "Riv_192" },
            { width: 448,  height: 1024, name: "Len" },
            { width: 288,  height: 704, name: "Sochi" },
            { width: 480,  height: 1200, name: "BC Himki" },
            { width: 512,  height: 1344, name: "NN_Gor" }
        ],
        "1344x6144": [
            { width: 224,  height: 768, name: "Rum" }
        ],
        "720x760": [
            { width: 624,  height: 672, name: "SMR" },
            { width: 1024, height: 1120, name: "Silikat" },
            { width: 512,  height: 576, name: "NN_Bel" },
            { width: 448,  height: 512, name: "Gorki" },
            { width: 1088, height: 1280, name: "TMN" },
            { width: 640,  height: 768, name: "NN_Rev" },
            { width: 960,  height: 1248, name: "Tul TTK" }
        ],
        "960x1408": [
            { width: 800,  height: 1152, name: "SMR Kosh_800" },
            { width: 640,  height: 896, name: "NN_Komsa 1A_640" },
            { width: 104,  height: 152, name: "SMR_Kosh_104_1" },
        ]
    };

    // Case-insensitive folder search
    function findFolderByNameIgnoreCase(folderName) {
        var targetName = folderName.toLowerCase();
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (item instanceof FolderItem && item.name.toLowerCase() === targetName) {
                return item;
            }
        }
        return null;
    }

    // Only comps in the matched folder with exact size
    function findCompsMatchingSizeInFolder(width, height, folder) {
        var matches = [];
        for (var i = 1; i <= app.project.numItems; i++) {
            var item = app.project.item(i);
            if (
                item instanceof CompItem &&
                item.width === width &&
                item.height === height &&
                item.parentFolder === folder
            ) {
                matches.push(item);
            }
        }
        return matches;
    }

    // Duplicate comp and apply new size and name
    function duplicateAndResizeComp(baseComp, targetSizes) {
        var duplicates = [];

        for (var i = 0; i < targetSizes.length; i++) {
            var size = targetSizes[i];
            var nameSuffix = size.name || (size.width + "x" + size.height);

            var newComp = baseComp.duplicate();
            newComp.name = nameSuffix;
            newComp.width = size.width;
            newComp.height = size.height;

            // ❌ No layer scaling
            duplicates.push(newComp);
        }

        return duplicates;
    }

    // Main runner
    function runBatchResize(config) {
        app.beginUndoGroup("Batch Duplicate & Resize Comps");

        var compsFolder = findFolderByNameIgnoreCase("Comps");
        if (!compsFolder) {
            alert("Folder named 'Comps' not found (case-insensitive).");
            app.endUndoGroup();
            return;
        }

        var totalCreated = 0;

        for (var baseSize in config) {
            var parts = baseSize.split("x");
            var baseWidth = parseInt(parts[0], 10);
            var baseHeight = parseInt(parts[1], 10);
            var targetSizes = config[baseSize];

            var matchingComps = findCompsMatchingSizeInFolder(baseWidth, baseHeight, compsFolder);

            for (var i = 0; i < matchingComps.length; i++) {
                var baseComp = matchingComps[i];
                var newComps = duplicateAndResizeComp(baseComp, targetSizes);
                totalCreated += newComps.length;
            }
        }

        app.endUndoGroup();
        alert("Done! Created " + totalCreated + " resized compositions (no scaling applied).");
    }

    runBatchResize(resizeConfig);
}
