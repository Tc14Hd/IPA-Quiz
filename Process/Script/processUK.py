fileRaw = open("../Raw/britfone.csv", "r")
lines = fileRaw.readlines()
fileRaw.close()

fileDict = open("../Dict/en-uk-dict.txt", "w")

for line in lines:

    lineSplit = line.rstrip().split(", ")
    word = lineSplit[0].lower()
    phonemesListRaw = lineSplit[1].split(" ")

    pos = word.find("(") 
    if pos != -1:
        word = word[:pos]

    phonemesList = []
    for phoneme in phonemesListRaw:

        if phoneme[0] == "ˈ" or phoneme[0] == "ˌ":
            phonemesList.append(phoneme[0])
            phoneme = phoneme[1:]

        if phoneme == "ɐ":
            phoneme = "ʌ"

        phonemesList.append(phoneme)

    fileDict.write(word)
    fileDict.write("; ")

    for i in range(len(phonemesList)):

        if i != 0:
            fileDict.write(" ")
        fileDict.write(phonemesList[i])

    fileDict.write("\n")

fileDict.close()
