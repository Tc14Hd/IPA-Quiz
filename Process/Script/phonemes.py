file = open("../Dict/en-uk-dict.txt", "r")
lines = file.readlines()
file.close()

Count = dict()

for line in lines:

    lineSplit = line.rstrip().split("; ")
    phonemesList = lineSplit[1].split(" ")

    for phoneme in phonemesList:
        if phoneme in Count:
            Count[phoneme] += 1
        else:
            Count[phoneme] = 1

print(len(Count))
for phoneme in Count:
    print(phoneme, Count[phoneme])
