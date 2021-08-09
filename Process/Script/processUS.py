cmuReplace = open("../Raw/cmudict-replace.txt", "r")
lines = cmuReplace.readlines()
cmuReplace.close()

CodeToIPA = dict()
for line in lines:

    lineSplit = line.rstrip().split(" ")
    code = lineSplit[0]
    ipa = lineSplit[1]

    CodeToIPA[code] = ipa

cmuDict = open("../Raw/cmudict-dict.txt", "r")
lines = cmuDict.readlines()
cmuDict.close()

fileDicr = open("../Dict/en-us-dict.txt", "w")

for line in lines:

    pos = line.find("#")
    if pos != -1:
        line = line[:pos]

    lineSplit = line.rstrip().split(" ")

    word = lineSplit[0]
    pos = word.find("(") 
    if pos != -1:
        word = word[:pos]

    phonemesList = []
    for code in lineSplit[1:]:

        if code[-1] == "0":
            code = code[:-1]

            if code == "AH":
                phonemesList.append("ə")
                continue

        elif code[-1] == "1":
            code = code[:-1]
            phonemesList.append("ˈ")

        elif code[-1] == "2":
            code = code[:-1]
            phonemesList.append("ˌ")

        phonemesList.append(CodeToIPA[code])

    fileDicr.write(word)
    fileDicr.write("; ")

    for i in range(len(phonemesList)):

        if i != 0:
            fileDicr.write(" ")
        fileDicr.write(phonemesList[i])

    fileDicr.write("\n")

fileDicr.close()
