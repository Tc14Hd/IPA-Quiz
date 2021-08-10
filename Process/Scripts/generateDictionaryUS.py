cmuReplace = open("../Raw/cmudict-replace.txt", "r")
lines = cmuReplace.readlines()
cmuReplace.close()

CodeToIPA = dict()
for line in lines:

    lineSplit = line.rstrip().split(" ")
    code = lineSplit[0]
    ipa = lineSplit[1]

    CodeToIPA[code] = ipa

cmuDictionary = open("../Raw/cmudict-dictionary.txt", "r")
lines = cmuDictionary.readlines()
cmuDictionary.close()

fileDictionary = open("../Dictionary/en-us-dictionary.txt", "w")

for line in lines:

    pos = line.find("#")
    if pos != -1:
        line = line[:pos]

    lineSplit = line.rstrip().split(" ")

    word = lineSplit[0]
    pos = word.find("(") 
    if pos != -1:
        word = word[:pos]

    phonemes = []
    for code in lineSplit[1:]:

        if code[-1] == "0":
            code = code[:-1]

            if code == "AH":
                phonemes.append("ə")
                continue

        elif code[-1] == "1":
            code = code[:-1]
            phonemes.append("ˈ")

        elif code[-1] == "2":
            code = code[:-1]
            phonemes.append("ˌ")

        phonemes.append(CodeToIPA[code])

    fileDictionary.write(word)
    fileDictionary.write("; ")

    for i in range(len(phonemes)):

        if i != 0:
            fileDictionary.write(" ")
        fileDictionary.write(phonemes[i])

    fileDictionary.write("\n")

fileDictionary.close()
