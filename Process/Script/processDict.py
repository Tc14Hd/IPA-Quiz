# read frequency list
fileFreq = open("../Freq/freqCut.txt")
freqList = fileFreq.readlines()
fileFreq.close()

for i in range(len(freqList)):
    freqList[i] = freqList[i].split(" ")[0]

# generate data set
def generateDataSet(name, n):

    # read pronunciation dictionary
    fileDict = open("../Dict/" + name + "-dict.txt", "r")
    lines = fileDict.readlines()
    fileDict.close()

    phonemesListDict = dict()
    for line in lines:

        lineSplit = line.rstrip().split("; ")
        word = lineSplit[0]
        phonemesList = lineSplit[1].split(", ")
        phonemesList = tuple(phonemesList)

        if word not in phonemesListDict:
            phonemesListDict[word] = phonemesList

    # select words for data set
    dataSet = dict()
    fails = []

    for word in freqList:

        if word in phonemesListDict:

            phonemesList = phonemesListDict[word]
            if phonemesList in dataSet:
                dataSet[phonemesList].append(word)
            else:
                dataSet[phonemesList] = [word]

        else:            
            fails.append(word)

        if len(dataSet) >= n:
            break

    print("Fails", name, ":", len(fails))

    # add missing homophones
    for word, phonemesList in phonemesListDict.items():
        if phonemesList in dataSet:
            if word not in dataSet[phonemesList]:
                dataSet[phonemesList].append(word)

    # write data set
    fileData = open("../Data/" + name + "-data.txt", "w")

    for phonemesList, wordList in dataSet.items():

        for i in range(len(phonemesList)):

            if i != 0:
                fileData.write(" ")
            fileData.write(phonemesList[i])

        fileData.write("; ")

        wordList.sort()
        for i in range(len(wordList)):

            if i != 0:
                fileData.write(" ")
            fileData.write(wordList[i])

        fileData.write("\n")

    fileData.close()

# generate data sets
generateDataSet("en-uk", 5000)
generateDataSet("en-us", 5000)
