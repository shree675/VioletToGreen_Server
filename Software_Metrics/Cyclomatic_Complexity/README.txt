Compilation :
1. cd into the /src dir.
2. Run the command "javac -cp :../lib/antlr-runtime-4.5.2.jar:../lib/json-simple-1.1.1.jar antlr4/*.java grammar/*.java -d ../bin/" 
3. The compiled output will be saved to the "bin" directory.

Running :
1. cd into the /bin dir.
2. Run the command "java -cp :../lib/antlr-runtime-4.5.2.jar:../lib/json-simple-1.1.1.jar antlr4.Main <input_file>.java"
3. The output is save to output/Output.json



Alternate Execution:
1. In the /lib dir, run the command "java -jar out.jar <input_file>.java"


To generate the jar file :
1. In the "bin" dir, run the command "jar cmvf Manifest.txt out.jar antlr4/*.class grammar/*.class".
2. move the "out.jar" to /lib dir