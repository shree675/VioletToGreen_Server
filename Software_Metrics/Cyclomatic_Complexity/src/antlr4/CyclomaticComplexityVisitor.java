package antlr4;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.StringWriter;
import java.util.Stack;

import org.antlr.v4.runtime.RuleContext;
import org.json.simple.JSONObject;  

import grammar.JavaBaseVisitor;
import grammar.JavaParser;
import grammar.JavaParser.ClassDeclarationContext;
import grammar.JavaParser.ConstructorDeclarationContext;
import grammar.JavaParser.EnumDeclarationContext;
import grammar.JavaParser.ExpressionContext;
import grammar.JavaParser.MethodDeclarationContext;
import grammar.JavaParser.StatementContext;

public class CyclomaticComplexityVisitor extends JavaBaseVisitor<Integer> {

	protected Stack<Entry> entryStack = new Stack<Entry>();
	protected BufferedWriter bw;
	protected JSONObject jsonObj;
	
	// constructor
	CyclomaticComplexityVisitor(String outputPath) {
		try{
			this.bw = new BufferedWriter(new FileWriter(outputPath, false));
		}catch(Exception e){
			e.printStackTrace();
		}

 		this.jsonObj = new JSONObject();

    }

	@Override
	public Integer visitStatement(StatementContext ctx) {
		RuleContext rc = ctx.getPayload();

		if (rc != null) {
			//we have a while loop
			if (ctx.getTokens(JavaParser.ELSE).size() > 0 || 
					ctx.getTokens(JavaParser.IF).size() > 0 ||
					ctx.getTokens(JavaParser.WHILE).size() > 0 || 
					ctx.getTokens(JavaParser.FOR).size() > 0 ||
					ctx.getTokens(JavaParser.CATCH).size() > 0 ||
					ctx.getTokens(JavaParser.SWITCH).size() > 0 ||
					ctx.getTokens(JavaParser.DO).size() > 0 ) {

				entryStack.peek().bumpDecisionPoints();
				return super.visitStatement(ctx);
			}
		}

		return super.visitStatement(ctx);
	}

	@Override
	public Integer visitExpression(ExpressionContext ctx) {
		//expression '?' expression ':' expression
		if (ctx.getTokens(JavaParser.QUESTION).size() > 0) {
			entryStack.peek().bumpDecisionPoints();
		}

		return super.visitExpression(ctx);
	}

	@Override
	public Integer visitMethodDeclaration(MethodDeclarationContext ctx) {
		entryStack.push( new Entry( ctx ) );
		Integer res = super.visitMethodDeclaration(ctx);

		Entry methodEntry = entryStack.pop();

		int methodDecisionPoints = methodEntry.decisionPoints;

		//System.out.printf(" - [%-20s method] - CC: %d\n", ctx.Identifier().getText(), methodDecisionPoints);

		this.jsonObj.put(ctx.Identifier().getText(), methodDecisionPoints);


		Entry classEntry = entryStack.peek();
		classEntry.methodCount++;
		classEntry.bumpDecisionPoints( methodDecisionPoints );

		if ( methodDecisionPoints > classEntry.highestDecisionPoints ) {
			classEntry.highestDecisionPoints = methodDecisionPoints;
		}

		return res;
	}

	@Override
	public Integer visitClassDeclaration(ClassDeclarationContext ctx) {
		entryStack.push( new Entry( ctx) );
		Integer res = super.visitClassDeclaration(ctx);

		Entry classEntry = entryStack.peek();

		// System.out.printf("overall methods count: %d\n", classEntry.methodCount);
		
		double avgCC = classEntry.methodCount != 0 ? classEntry.decisionPoints * 1f / classEntry.methodCount : 0;
		
		//System.out.printf("[%-20s class] - avg CC: %.2f\n", ctx.Identifier().getText(), avgCC);

		this.jsonObj.put(ctx.Identifier().getText(), avgCC);


		try {
      		StringWriter out = new StringWriter();
      		this.jsonObj.writeJSONString(out);
      
      		String jsonText = out.toString();
			bw.write(jsonText);
			bw.close();	
		} catch (Exception e) {
			//TODO: handle exception
		}

		return res;
	}

	@Override
	public Integer visitConstructorDeclaration(ConstructorDeclarationContext ctx) {
		entryStack.push( new Entry( ctx ) );
		Integer res = super.visitConstructorDeclaration(ctx);
		Entry constructorEntry = entryStack.pop();

		int constructorDecisionPointCount = constructorEntry.decisionPoints;
		Entry classEntry = entryStack.peek();
		classEntry.methodCount++;
		classEntry.decisionPoints += constructorDecisionPointCount;

		if ( constructorDecisionPointCount > classEntry.highestDecisionPoints ) {
			classEntry.highestDecisionPoints = constructorDecisionPointCount;
		}

		return res;
	}

	@Override
	public Integer visitEnumDeclaration(EnumDeclarationContext ctx) {
		entryStack.push( new Entry( ctx ) );
		Integer res = super.visitEnumDeclaration(ctx);
		Entry classEntry = entryStack.pop();

		return res;
	}
}


class Entry {
	private Object node;
	public int decisionPoints = 1;
	public int highestDecisionPoints;
	public int methodCount;

	Entry(Object node) {
		this.node = node;
	}

	public void bumpDecisionPoints() {
		decisionPoints++;
	}

	public void bumpDecisionPoints(int size) {
		decisionPoints += size;
	}

	public int getComplexityAverage() {
		return (double) methodCount == 0 ? 1
				: (int) Math.rint( (double) decisionPoints / (double) methodCount );
	}
}
